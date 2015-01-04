(function () {
  'use strict';

  angular
    .module('app')
    .config(routes);

  routes.$inject = [ '$routeProvider', 'config' ];

  function routes($routeProvider, config) {
    $routeProvider
    .when('/environments', {
      templateUrl: 'client/environments/list.html',
      controller: 'EnvironmentListController',
      controllerAs: 'vm'
    })
    .when('/jobs/:jobId', {
      templateUrl: 'client/jobs/details.html',
      controller: 'JobDetailsController',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: '/environments'
    });
  }

}());