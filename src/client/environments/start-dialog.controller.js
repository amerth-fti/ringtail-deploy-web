(function() {
  'use strict';

  angular
    .module('app')
    .controller('EnvironmentStartController', EnvironmentStartController);

  EnvironmentStartController.$inject = [ '$modalInstance', 'environment', 'DeployInfo' ]; 

  function EnvironmentStartController($modalInstance, environment, DeployInfo) {
    var vm          = this;
    vm.environment  = environment;
    vm.deployinfo   = new DeployInfo();
    vm.duration     = 15;
    vm.cancel       = cancel;
    vm.start        = start;

    //////////

    function cancel() {
      $modalInstance.dismiss();
    }

    function start() {
      $modalInstance.close({ 
        duration: vm.duration, 
        deployinfo: vm.deployinfo
      });
    }
  }

}());