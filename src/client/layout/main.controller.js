(function() {
  'use strict';


  angular
    .module('app')
    .controller('MainController', MainController);

    MainController.$inject = [ '$scope', 'globals', 'Region' ];
      
    function MainController($scope, globals, Region) {
      $scope.globals        = globals;    
      $scope.regions        = null;
      $scope.selectedRegion = null;

      activate();

      //////////

      function activate() {
        $scope.regions = Region.query();        
      }

    }

}());