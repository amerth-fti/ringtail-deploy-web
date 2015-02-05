(function () {
  'use strict';

  angular
    .module('app.regions')
    .config(routes);

  routes.$inject = [ '$routeProvider' ];

  function routes($routeProvider, config) {
    $routeProvider
    .when('/app/regions/:regionId', {
      templateUrl: '/app/regions/details-route.html',
      controller: 'RegionDetailsRouteController',
      controllerAs: 'vm'
    });    
  }

}());