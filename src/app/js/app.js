'use strict';

var app = angular.module('app', [
  'ngRoute',
  'ui.bootstrap',
  'controllers',
  'services',
  'filters'
  ]);

app.constant('config', window.appConfig);

app.config(['$routeProvider', 'config',
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
    .when('/jobs/:jobId', {
      templateUrl: 'app/partials/job-details.html',
      controller: 'JobDetailsCtrl'
    })
    .otherwise({
      redirectTo: config.defaultRoute || '/projects/'
    });

  }]);

