(function () {
  'use strict';

  angular
    .module('app.swarm')
    .config(routes);

  routes.$inject = [ '$routeProvider' ];

  function routes($routeProvider, config) {
    $routeProvider
    .when('/app/swarm/:envId', {
      templateUrl: '/app/swarm/details-route.html',
      controller: 'SwarmDetailsRouteController',
      controllerAs: 'vm'
    });
  }

}());