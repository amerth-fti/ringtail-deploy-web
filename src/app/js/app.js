'use strict';

var deployerApp = angular.module('deployerApp', [
  'ngRoute',
  'deployerControllers',
  'deployerServices'
  ]);

deployerApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/projects', {
      templateUrl: 'app/partials/project-list.html',
      controller: 'ProjectListCtrl'
    }).
    when('/projects/:projectId', {
      templateUrl: 'app/partials/project-details.html',
      controller: 'ProjectDetailsCtrl'
    }).
    when('/environments/:environmentId', {
      templateUrl: 'app/partials/environment-details.html',
      controller: 'EnvironmentDetailsCtrl'
    }).
    otherwise({
      redirectTo: '/projects'
    });
  }]);