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
  '$location',
  'config',
  'Project', 
  'Environment',
  'Task',
  function($scope, $routeParams, $modal, $location, config, Project, Environment, Task) {
    
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
      var modal = $modal.open({
        templateUrl: 'app/partials/environment-redeploy.html',
        controller: 'EnvironmentRedeployCtrl',
        resolve: {
          environment: function() {
            return environment;
          }
        }
      });

      modal.result.then(function(branch) {
        var opts = {          
          project_id: $scope.project.id,
          branch: branch
        };
        environment.$redeploy(opts, function(results) {          
          var path = '/tasks/' + results.taskId;
          console.log(path);
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
      })
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

    $scope.rebuild = function() {
      $modalInstance.close($scope.selectedBranch);
    }

    $scope.cancel = function() {
      $modalInstance.dismiss();
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
 * Controller for showing task details
 */
controllers.controller('TaskDetailsCtrl', [
  '$scope', 
  '$routeParams', 
  '$modal',  
  'Task',
  function($scope, $routeParams, $modal, Task) {    

    // load the task
    $scope.task = Task.get({taskId: $routeParams.taskId}, loadTaskComplete);

    function loadTaskComplete(result) {      
      $scope.task = result;      
      pollWhileRunning(result);
    }

    function pollWhileRunning(task) {
      if(task.status === 'Running') {
        setTimeout(function() {
          task.$get(loadTaskComplete);
        }, 5000);
      }
    }

  }]);



