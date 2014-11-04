'use strict';

var deployerControllers = angular.module('deployerControllers', []);


deployerControllers.controller('ProjectListCtrl', ['$scope', 'Project',
  function($scope, Project) {

    $scope.projects = Project.query();

  }]);


deployerControllers.controller('ProjectDetailsCtrl', ['$scope', '$routeParams', 'Project', 'ProjectEnvironment',
  function($scope, $routeParams, Project, ProjectEnvironment) {

    $scope.project = Project.get({projectId: $routeParams.projectId});
    $scope.environments = ProjectEnvironment.query({projectId: $routeParams.projectId});

  }]);


deployerControllers.controller('EnvironmentDetailsCtrl', ['$scope', '$routeParams', 'Environment', 
  function($scope, $routeParams, Environment) {

    $scope.environment = Environment.get({ environmentId: $routeParams.environmentId });

  }]);