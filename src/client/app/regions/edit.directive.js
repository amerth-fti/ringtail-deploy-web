(function() {
  'use strict';

  angular
    .module('app.regions')
    .directive('regionEdit', directive);

  function directive() {
    return { 
      restrict: 'E',
      scope: {
        regionId: '='
      },
      templateUrl: '/app/regions/edit.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ 'Region', '$location', '$rootScope' ];

  function Controller(Region, $location, $rootScope) {
    var vm    = this;
    vm.region = null;    
    vm.cancel = cancel;
    vm.save   = save;
    
    activate();

    //////////
    
    function activate() {
      vm.region = Region.get({ regionId: vm.regionId });      
    }

    function navigateToRegion() {
      var path = '/app/regions/' + vm.region.regionId;          
      $location.path(path);
    }

    function save() {      
      return vm.region
        .$update()
        .then(function(region) {      
          $rootScope.$emit('region-saved', region);
          navigateToRegion();
        });
    }

    function cancel() {
      navigateToRegion();
    }
  }

}());