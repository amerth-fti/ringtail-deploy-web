(function () {
  'use strict';

  angular
    .module('app.regions')
    .config(routes);

  routes.$inject = [ '$routeProvider' ];

  function routes($routeProvider, config) {
    $routeProvider
    .when('/app/regions', {
      templateUrl: '/app/regions/list-route.html',
      controller: 'RegionListRouteController',
      controllerAs: 'vm'
    })    
    .when('/app/regions/:regionId', {
      templateUrl: '/app/regions/details-route.html',
      controller: 'RegionDetailsRouteController',
      controllerAs: 'vm'
    })
    .when('/app/regions/:regionId/edit', {
      templateUrl: '/app/regions/edit-route.html',
      controller: 'RegionEditRouteController',
      controllerAs: 'vm'
    })
    .when('/app/regions/:regionId/environment-edit', {
      templateUrl: '/app/regions/environment-edit-route.html',
      controller: 'RegionEnvironmentEditController',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: '/app/regions'
    });  
  }

}());