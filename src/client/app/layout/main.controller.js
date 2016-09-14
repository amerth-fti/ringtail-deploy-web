(function() {
  'use strict';


  angular
    .module('app')
    .controller('MainController', MainController);

    MainController.$inject = [ '$rootScope', 'Region', 'DeployerSession'];
      
    function MainController($rootScope, Region, DeployerSession) {      
      var vm            = this;      
      vm.regions        = null;        
      vm.selectedRegion = null;    
      vm.user           = 'anonymous';  

      activate();

      //check user logged in status
      window.checklogin = setInterval(checkLogin, 5000);
      checkLogin();      

      function checkLogin() {
        DeployerSession.query({ }, function(result) {
          if(result && typeof result.loggedIn != 'undefined' && !result.loggedIn) {
            window.location.reload(true);
          } 
          else if(result) {
            vm.user = result && result.user || null;  
            
            if(result.disabledCheck) {
              window.clearInterval(window.checklogin);
            }
          }
        });
      }

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