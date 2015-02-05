(function() {
  'use strict';

  angular
    .module('app.regions')
    .directive('regionDetails', regionDetails);

  function regionDetails() {
    return { 
      restrict: 'E',
      scope: {
        regionId: '='
      },
      templateUrl: '/app/regions/details.html',
      controller: RegionDetailsController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  RegionDetailsController.$inject = [ 'Region', 'Environment', 'EnvironmentEditor' ];

  function RegionDetailsController(Region, Environment, EnvironmentEditor) {
    var vm            = this;
    vm.region         = null;
    vm.environments   = null;
    vm.newEnvironment = newEnvironment;
    
    activate();

    //////////
    
    function activate() {
      vm.region       = Region.get({ regionId: vm.regionId });
      vm.environments = Environment.region({ regionId: vm.regionId });
    }

    function newEnvironment() {
      return EnvironmentEditor.open()
        .result
        .then(function(env) {
          vm.environments.push(env);
        });
    }
  }

}());