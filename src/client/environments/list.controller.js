(function() {
  'use strict';

  angular
    .module('app')
    .controller('EnvironmentListController', EnvironmentListController);

  EnvironmentListController.$inject = [ '$scope', '$routeParams', '$modal', '$location', 'config', 'Project', 'Environment', 'Job' ];

  function EnvironmentListController($scope, $routeParams, $modal, $location, config, Project, Environment, Job) {
    
    $scope.config = config;    

    // load the project
    $scope.project = Project.get({projectId: $routeParams.projectId});    

    // create empty environments
    $scope.environments = [];

    function showEnv(env) {
      $scope.environments.push(env);
      $scope.environments.sort(function(env1, env2) {
        return env1.name.toLowerCase() > env2.name.toLowerCase();
      });
    };

    function hideEnv(env) {
      var indexLookup = {};
      $scope.environments.forEach(function(env, idx) {
        indexLookup[env.id] = idx;
      });
      if(indexLookup[env.id]) {
        $scope.environments.splice(indexLookup[env.id], 1);
      }
    }

    // load the environment shells
    Environment.project({projectId: $routeParams.projectId}, function(environments) {

      // load environment details
      environments.forEach(function(environment) {
        environment.$get(function(environment) {        
          processEnvironment(environment);

          if(environment.deployment.status !== 'hidden')
            showEnv(environment);
        });          
      });
      
      return environments;
    });

    function processEnvironment(environment) {
      setViewModelProperties(environment);
      pollWhileBusy(environment);      
      performRedploymentRedirect(environment);      
      return environment;
    }
            
    function setViewModelProperties(environment) {
      environment.showStart = environment.runstate === 'suspended' || environment.runstate === 'stopped';
      environment.showPause = environment.runstate === 'running';      
      try
      {        
        environment.deployment = JSON.parse(environment.user_data.contents);
        environment.deployment.status = environment.deployment.status || 'deployed';
        
      }
      catch (ex)
      {        
        environment.deployment = {}
        environment.deployment.status = 'initialize';        
      }

      environment.show = environment.deployment.status !== 'hidden';
    };

    function pollWhileBusy(environment) {      
      if(environment.runstate === 'busy' || environment.deployment.status === 'deploying') {
        setTimeout(function() {
          environment.$get(processEnvironment);
        }, 15000);
      }
    }

    function performRedploymentRedirect(environment) {
      if(environment.deployment.status === 'hidden' && environment.deployment.deployingTo) {
        // swap id's so we can load the newly deployed one
        environment.id = environment.deployment.deployingTo;
        environment.$get(processEnvironment);
      }
    }

    $scope.start = function(environment) {      
      var modal = $modal.open({
        templateUrl: 'client/environments/start-dialog.html',
        controller: 'EnvironmentStartController',
        resolve: {
          environment: function() { 
            return environment
          }
        }
      });

      modal.result.then(function(startinfo) {
        var qs = {
          suspend_on_idle: startinfo.duration * 60,
        }
        environment.deployinfo = startinfo.deployinfo;
        environment.$start(qs, processEnvironment);
      });
    }

    $scope.pause = function(environment) {
      environment.$pause(processEnvironment);
    }

    $scope.redeploy = function(environment) {
      var modal = $modal.open({
        templateUrl: 'client/environments/redeploy-dialog.html',
        controller: 'EnvironmentRedeployController',
        resolve: {
          environment: function() {
            return environment;
          }
        }
      });

      modal.result.then(function(data) {
        
        // send these in the post body
        environment.deployment.taskdefs = data.taskdefs;  
        environment.deployment.deployinfo = data.deployinfo;
        delete data.taskdefs
        delete data.deployinfo;

        // post the change and include querystring data
        environment.$redeploy(data, function(results) {          
          var path = '/jobs/' + results.jobId;          
          $location.path(path);
        });
        
      })
    }

    $scope.configure = function(environment) {      
      var modal = $modal.open({
        size: 'lg',
        templateUrl: 'client/environments/config-dialog.html',
        controller: 'EnvironmentConfigController',
        resolve: {
          environment: function() {
            return environment;
          }
        }
      });

      modal.result.then(function() {
        environment.$update(processEnvironment);
      });
    }

    $scope.initialize = function(environment) {
      environment.user_data.contents = JSON.stringify(config.intialize, null, 2);
      environment.$update(processEnvironment);
    }

  }

}());