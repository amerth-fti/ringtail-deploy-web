'use strict';


var deployerApp = angular.module('deployerApp', [
  'ngRoute',
  'ui.bootstrap',
  'deployerControllers',
  'deployerServices'  
  ]);

deployerApp.constant('config', window.appConfig);

deployerApp.config(['$routeProvider', 'config',
  function($routeProvider, config) {

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
      redirectTo: config.defaultRoute || '/projects/'
    });

  }]);

