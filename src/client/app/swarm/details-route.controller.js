(function() {
  'use strict';

  angular
    .module('app.swarm')
    .controller('SwarmDetailsRouteController', SwarmDetailsRouteController);

  SwarmDetailsRouteController.$inject = [ '$routeParams' ];

  function SwarmDetailsRouteController($routeParams) {
    var vm   = this;
    vm.envId = $routeParams.envId;
  }

}());