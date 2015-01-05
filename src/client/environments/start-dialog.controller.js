(function() {
  'use strict';

  angular
    .module('app.environments')
    .controller('EnvironmentStartController', EnvironmentStartController);

  EnvironmentStartController.$inject = [ '$modalInstance', 'environment' ]; 

  function EnvironmentStartController($modalInstance, environment) {
    var vm          = this;
    vm.environment  = null;
    vm.duration     = 15;
    vm.cancel       = cancel;
    vm.start        = start;

    activate();

    //////////

    function activate() {
      vm.environment = angular.copy(environment);
    }

    function cancel() {
      $modalInstance.dismiss();
    }

    function start() {      
      angular.copy(vm.environment, environment);
      $modalInstance.close({ 
        duration: vm.duration        
      });
    }
  }

}());