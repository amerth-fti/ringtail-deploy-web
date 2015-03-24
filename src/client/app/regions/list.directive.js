(function() {
  'use strict';

  angular
    .module('app.regions')
    .directive('regionList', directive);

  function directive() {
    return { 
      restrict: 'E',
      scope: {        
      },
      templateUrl: '/app/regions/list.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ '$location', 'Region' ];

  function Controller($location, Region) {
    var vm     = this;
    vm.regions = null;
    vm.loading = true;
    
    activate();

    //////////
    
    function activate() {
      vm.regions = Region.query({ }, function(regions) {
        vm.loading = false;
        if(regions && regions.length > 0) {
          var path = '/app/regions/' + regions[0].regionId;  
          $location.path(path);
        }
      });
    }  
  }

}());