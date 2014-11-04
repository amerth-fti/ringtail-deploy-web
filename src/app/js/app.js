'use strict';

var deployerApp = angular.module('deployerApp', [
  'ngRoute',
  'ui.bootstrap',
  'deployerControllers',
  'deployerServices'
  ]);

deployerApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/projects/:projectId', {
      templateUrl: 'app/partials/project-details.html',
      controller: 'ProjectDetailsCtrl'
    }).
    otherwise({
      redirectTo: '/projects/31502'
    });
  }]);