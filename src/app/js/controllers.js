'use strict';

var deployerControllers = angular.module('deployerControllers', []);

deployerControllers.controller('ProjectListCtrl', ['$scope', 'Project',
  function($scope, Project) {
    $scope.projects = Project.query();
  }]);

deployerControllers.controller('ProjectDetailsCtrl', ['$scope', '$routeParams', 'Project', 'Environment',
  function($scope, $routeParams, Project, Environment) {

    $scope.project = Project.get({projectId: $routeParams.projectId});
    $scope.environments = Environment.query({projectId: $routeParams.projectId});

  }]);