(function() {
  'use strict';

  angular
    .module('app.regions')
    .controller('RegionDetailsRouteController', RegionDetailsRouteController);

  RegionDetailsRouteController.$inject = [ '$routeParams' ];

  function RegionDetailsRouteController($routeParams) {
    var vm      = this;
    vm.regionId = $routeParams.regionId;
  }

}());