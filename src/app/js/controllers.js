'use strict';

var deployerControllers = angular.module('deployerControllers', []);


deployerControllers.controller('ProjectListCtrl', ['$scope', 'Project',
  function($scope, Project) {

    $scope.projects = Project.query();

  }]);


deployerControllers.controller('ProjectDetailsCtrl', ['$scope', '$routeParams', '$modal', 'Project', 'ProjectEnvironment',
  function($scope, $routeParams, $modal, Project, ProjectEnvironment) {

    $scope.project = Project.get({projectId: $routeParams.projectId});
    $scope.environments = ProjectEnvironment.query({projectId: $routeParams.projectId});

    var modalInstance;

    $scope.openStart = function(environment) {      
      var modal = $modal.open({
        templateUrl: 'app/partials/environment-start.html',
        controller: 'EnvironmentStartCtrl',
        resolve: {
          environment: function() { 
            return environment
          }
        }
      });

      modal.result.then(function(time) {

      });
    }

  }]);


deployerControllers.controller('EnvironmentStartCtrl', ['$scope', '$modalInstance', 'environment',
  function($scope, $modalInstance, environment) {

    $scope.environment = environment;

    $scope.start = function() {
      $modalInstance.close();
    }

    $scope.cancel = function() {
      $modalInstance.dismiss();
    }

  }]);