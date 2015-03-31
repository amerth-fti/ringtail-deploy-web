(function() {
  'use strict';

  angular
    .module('app.regions')
    .controller('RegionEditRouteController', Controller);

  Controller.$inject = [ '$routeParams' ];

  function Controller($routeParams) {
    var vm      = this;
    vm.regionId = $routeParams.regionId;
  }

}());