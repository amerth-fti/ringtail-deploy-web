(function() {
  'use strict';


  angular
    .module('app')
    .controller('MainController', MainController);

    MainController.$inject = [ '$scope', '$routeParams', 'globals', 'Region' ];
      
    function MainController($scope, $routeParams, globals, Region) {      
      $scope.globals        = globals;

      var vm = {};
      $scope.vm         = vm;
      vm.regions        = null;        
      vm.selectedRegion = null;
      vm.changeRegion   = changeRegion;

      activate();

      //////////

      function activate() {
        vm.regions        = Region.query();        
        vm.selectedRegion = $routeParams.regionId || 1;
      }

      function changeRegion(region) {
        vm.selectedRegion = region.regionId;
      }

    }

}());