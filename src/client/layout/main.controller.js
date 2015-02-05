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
      vm.routeParams    = $routeParams;

      activate();

      //////////

      function activate() {
        vm.regions = Region.query(); 
        watchRegionId();             
      }

      function watchRegionId() {
        $scope.$watch('vm.routeParams.regionId', function(regionId) {
          vm.selectedRegion = parseInt(regionId);
        });        
      }
    }

}());