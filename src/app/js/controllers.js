'use strict';

var deployerControllers = angular.module('deployerControllers', []);


deployerControllers.controller('ProjectListCtrl', ['$scope', 'Project',
  function($scope, Project) {

    $scope.projects = Project.query();

  }]);


deployerControllers.controller('ProjectDetailsCtrl', [
  '$scope', 
  '$routeParams', 
  '$modal', 
  'Project', 
  'ProjectEnvironment',
  function($scope, $routeParams, $modal, Project, ProjectEnvironment) {

    var modalInstance;

    $scope.project = Project.get({projectId: $routeParams.projectId});
    $scope.environments = ProjectEnvironment.query({projectId: $routeParams.projectId}, function(environments) {      
      environments.forEach(setViewModelProperties);
      environments.forEach(pollWhileBusy);
      return environments;
    });
            
    function setViewModelProperties(environment) {
      environment.showStart = environment.runstate === 'suspended' || environment.runstate === 'stopped';
      environment.showPause = environment.runstate === 'running';
    };

    function pollWhileBusy(environment) {
      if(environment.runstate === 'busy') {
        setTimeout(function() {
          environment.$get(function(environment) {
            pollWhileBusy(environment);
            return environment;
          });
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
        environment.$start({ suspend_on_idle: minutes * 60 }, function(environment) {
          setViewModelProperties(environment);
          pollWhileBusy(environment);
        });
      });
    }

    $scope.pause = function(environment) {
      environment.$pause(function(environment) {
        setViewModelProperties(environment);
        pollWhileBusy(environment);
      });
    }



  }]);


deployerControllers.controller('EnvironmentStartCtrl', ['$scope', '$modalInstance', 'environment',
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