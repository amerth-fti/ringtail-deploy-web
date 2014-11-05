'use strict';

var deployerApp = angular.module('deployerApp', [
  'ngRoute',
  'ui.bootstrap',
  'deployerControllers',
  'deployerServices'
  ]);

deployerApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/projects', {
      templateUrl: 'app/partials/project-list.html',
      controller: 'ProjectListCtrl'
    })
    .when('/projects/:projectId', {
      templateUrl: 'app/partials/project-details.html',
      controller: 'ProjectDetailsCtrl'
    })
    .otherwise({
      redirectTo: '/projects/'
    });
  }]);