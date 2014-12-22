(function () {
  'use strict';

  angular
    .module('app')
    .config(routes);

  routes.$inject = [ '$routeProvider', 'config' ];

  function routes($routeProvider, config) {
    $routeProvider
    .when('/projects/:projectId', {
      templateUrl: 'client/environments/list.html',
      controller: 'EnvironmentListController'
    })
    .when('/jobs/:jobId', {
      templateUrl: 'client/jobs/details.html',
      controller: 'JobDetailsController'
    })
    .otherwise({
      redirectTo: config.defaultRoute || '/projects/34440'
    });
  }

}());