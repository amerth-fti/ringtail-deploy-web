(function () {
  'use strict';

  angular
    .module('app')
    .config(routes);

  routes.$inject = [ '$routeProvider', 'config' ];

  function routes($routeProvider, config) {
    $routeProvider
    .when('/app/jobs/:jobId', {
      templateUrl: '/app/jobs/details.html',
      controller: 'JobDetailsController',
      controllerAs: 'vm'
    })
    .when('/app/validations/:validationId', {
      templateUrl: '/app/validations/details.html',
      controller: 'ValidationDetailsController',
      controllerAs: 'vm'
    });    
  }

}());