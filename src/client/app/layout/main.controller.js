(function() {
  'use strict';


  angular
    .module('app')
    .controller('MainController', MainController);

    MainController.$inject = [ '$rootScope', 'Region', 'SkydemoSession'];
      
    function MainController($rootScope, Region, SkydemoSession) {      
      var vm            = this;      
      vm.regions        = null;        
      vm.selectedRegion = null;      

      activate();

      //check user logged in status
      setInterval(function(){
        SkydemoSession.query({ }, function(result) {
          if(!result || !result.loggedIn) {
            window.location.reload(true);
          }           
        });
      }, 5000);

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