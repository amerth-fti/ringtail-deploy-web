(function () {
  'use strict';

  angular
    .module('app')
    .controller('EnvironmentConfigController', EnvironmentConfigController);

  EnvironmentConfigController.$inject = [ '$modalInstance', 'config', 'environment' ];

  function EnvironmentConfigController($modalInstance, config, environment) {
    var vm          = this;
    vm.environment  = environment;
    vm.cancel       = cancel;
    vm.save         = save;

    activate();

    //////////

    function activate() {
      vm.environment.config = JSON.stringify(vm.environment.config, null, 2);
    }

    function save() {
      vm.environment.config = JSON.parse(vm.environment.config);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.dismiss();      
    }
  }

}());
