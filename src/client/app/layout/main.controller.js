(function() {
  'use strict';


  angular
    .module('app')
    .controller('MainController', MainController);

    MainController.$inject = [ '$rootScope', 'Region' ];
      
    function MainController($rootScope, Region) {      
      var vm            = this;      
      vm.regions        = null;        
      vm.selectedRegion = null;      

      activate();

      //////////

      function activate() {
        vm.regions = Region.query(); 
        watchRegionId();
        watchRegionUpdates();         
      }

      function watchRegionId() {
        $rootScope.$watch('routeParams.regionId', function(regionId) {
          vm.selectedRegion = parseInt(regionId);
        });              
      }

      function watchRegionUpdates() {
        $rootScope.$on('region-saved', function(e, savedRegion) {
          vm.regions.forEach(function(region) {
            if(region.regionId === savedRegion.regionId) {
              angular.copy(savedRegion, region);
            }
          });
        });     
      }
    }

}());