(function () {
  'use strict';

  angular
    .module('app')
    .controller('EnvironmentConfigController', EnvironmentConfigController);

  EnvironmentConfigController.$inject = [ '$modalInstance', 'config', 'environment' ];

  function EnvironmentConfigController($modalInstance, config, environment) {
    var vm = this;
    vm.environment = environment;
    vm.cancel = cancel;
    vm.save = save;

    //////////

    function save() {           
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.dismiss();      
    }
  }

}());
