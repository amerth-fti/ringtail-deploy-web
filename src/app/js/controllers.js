'use strict';

var controllers = angular.module('controllers', []);


controllers.controller('MainCtrl', ['$scope', 'globals',
  function($scope, globals) {
    $scope.globals = globals;    
  }]);

controllers.controller('ProjectListCtrl', ['$scope', 'Project',
  function($scope, Project) {

    $scope.projects = Project.query();

  }]);


controllers.controller('ProjectDetailsCtrl', [
  '$scope', 
  '$routeParams', 
  '$modal', 
  '$location',
  'config',
  'Project', 
  'Environment',
  'Job',
  function($scope, $routeParams, $modal, $location, config, Project, Environment, Job) {
    
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
        templateUrl: 'app/partials/environment-start.html',
        controller: 'EnvironmentStartCtrl',
        resolve: {
          environment: function() { 
            return environment
          }
        }
      });

      modal.result.then(function(minutes) {
        environment.$start({ suspend_on_idle: minutes * 60 }, processEnvironment);
      });
    }

    $scope.pause = function(environment) {
      environment.$pause(processEnvironment);
    }

    $scope.redeploy = function(environment) {
      var modal = $modal.open({
        templateUrl: 'app/partials/environment-redeploy.html',
        controller: 'EnvironmentRedeployCtrl',
        resolve: {
          environment: function() {
            return environment;
          }
        }
      });

      modal.result.then(function(data) {
        
        data.project_id = $scope.project.id;

        environment.$redeploy(data, function(results) {          
          var path = '/jobs/' + results.jobId;          
          $location.path(path);
        });
        
      })
    }

    $scope.configure = function(environment) {      
      var modal = $modal.open({
        size: 'lg',
        templateUrl: 'app/partials/environment-config.html',
        controller: 'EnvironmentConfigCtrl',
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

  }]);


controllers.controller('EnvironmentStartCtrl', ['$scope', '$modalInstance', 'environment',
  function($scope, $modalInstance, environment) {

    $scope.environment = environment;
    $scope.runLength = 15;

    $scope.start = function() {
      $modalInstance.close($scope.runLength);
    }

    $scope.cancel = function() {
      $modalInstance.dismiss();
    }

  }]);


controllers.controller('EnvironmentRedeployCtrl', ['$scope', '$modalInstance', 'config', 'environment', 
  function($scope, $modalInstance, config, environment) {

    $scope.environment = environment;
    $scope.branches = config.branches;
    $scope.selectedBranch;    
    $scope.showAdvanced = false;    
    
    if(environment.deployment.taskdefs) {      
      $scope.selectedTasks = environment.deployment.taskdefs.slice(0);
    }

    $scope.rebuild = function() {      
      environment.deployment.taskdefs = $scope.selectedTasks;
      $modalInstance.close({
        branch: $scope.selectedBranch,        
      });
    }

    $scope.cancel = function() {
      $modalInstance.dismiss();
    }

    $scope.toggleAdvanced = function() {
      $scope.showAdvanced = !$scope.showAdvanced;
    }

    $scope.toggleSelectedTask = function(taskdef) {
      var index = $scope.selectedTasks.indexOf(taskdef);
      if(index > -1) {
        $scope.selectedTasks.splice(index,1);
      }
      else {
        $scope.selectedTasks.push(taskdef);
      };
    }

  }]);


controllers.controller('EnvironmentConfigCtrl', ['$scope', '$modalInstance', 'config', 'environment', 
  function($scope, $modalInstance, config, environment) {

    $scope.environment = environment;

    $scope.save = function() {           
      $modalInstance.close();
    }

    $scope.cancel = function() {
      $modalInstance.dismiss();      
    }

  }]);


/**
 * Controller for showing job details
 */
controllers.controller('JobDetailsCtrl', [
  '$scope', 
  '$routeParams', 
  '$modal',  
  'Job',
  function($scope, $routeParams, $modal, Job) {    
    console.log('JobDetailsCtrl');

    // load the job
    $scope.job = Job.get({jobId: $routeParams.jobId}, loadJobComplete);


    function loadJobComplete(result) {      
      $scope.job = result;      
      $scope.job.elapsed = ($scope.job.stopped ? new Date($scope.job.stopped) : new Date()) - new Date($scope.job.started);      


      $scope.selectedTask = null;
      result.tasks.forEach(function(task) {
        if(task.status === 'Running') {
          $scope.selectedTask = task;
        }
      });
      
      if($scope.selectedTask == null) {
        $scope.selectedTask = result.tasks[0];
      }

      pollWhileRunning(result);
    }

    function pollWhileRunning(job) {
      if(job.status === 'Running') {
        setTimeout(function() {
          job.$get(loadJobComplete);
        }, 5000);
      }
    }


    $scope.taskClick = function(task) {
      $scope.selectedTask = task;
    }

  }]);



