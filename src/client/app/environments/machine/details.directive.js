(function() {
  'use strict';

  angular
    .module('app.environments.machine')
    .directive('machineDetails', machineDetails);

  function machineDetails() {
    return {
      restrict: 'E',
      scope: {
        configs: '=',
        machine: '=',
        editable: '=?'
      },
      templateUrl: '/app/environments/machine/details.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ ];

  function Controller() {
    var vm         = this;
    vm.configs     = this.configs;
    vm.machine     = this.machine;
    vm.editable    = this.editable;
    vm.config      = null;
    vm.configName  = null;
    vm.configIndex = null;

    activate();

    //////////

    function activate() {
      // find the config from the list of configs
      for(var i = 0; i < vm.configs.length; i++) {
        if(vm.configs[i].configId === vm.machine.configId) {
          vm.config = vm.configs[0];
          vm.configName = vm.config.configName;
          vm.configIndex = i;
          break;
        }
      }
    }
  }

}());