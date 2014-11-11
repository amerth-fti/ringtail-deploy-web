'use strict';

var controllers = angular.module('controllers', []);


controllers.controller('ProjectListCtrl', ['$scope', 'Project',
  function($scope, Project) {

    $scope.projects = Project.query();

  }]);


controllers.controller('ProjectDetailsCtrl', [
  '$scope', 
  '$routeParams', 
  '$modal', 
  'config',
  'Project', 
  'Environment',
  'Task',
  function($scope, $routeParams, $modal, config, Project, Environment, Task) {
    
    $scope.config = config;

    // load the project
    $scope.project = Project.get({projectId: $routeParams.projectId});

    // load the environment shells
    $scope.environments = Environment.project({projectId: $routeParams.projectId}, function(environments) {

      // load each environment
      environments.forEach(function(environment) {

        // indicate that it is loading...
        environment.loading = true;

        // retrieve the actual detailed value
        return environment.$get(function(environment) {

          environments.forEach(setViewModelProperties);
          environments.forEach(pollWhileBusy);
          return environment;
         
         });

      });
      
      return environments;
    });

    function processEnvironment(environment) {
      setViewModelProperties(environment);
      pollWhileBusy(environment);      
      return environment;
    }
            
    function setViewModelProperties(environment) {
      environment.showStart = environment.runstate === 'suspended' || environment.runstate === 'stopped';
      environment.showPause = environment.runstate === 'running';
    };

    function pollWhileBusy(environment) {
      if(environment.runstate === 'busy') {
        setTimeout(function() {
          environment.$get(processEnvironment);
        }, 10000);
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
      var opts = {
        id: environment.id,
        project_id: $scope.project.id,
        branch: 'MAIN'
      };
      environment.$redeploy(opts, processEnvironment);
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