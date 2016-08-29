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

  Controller.$inject = [ '$scope','validationMessage' ];

  function Controller($scope, validationMessage) {
    var vm         = this;
    vm.configs     = this.configs;
    vm.machine     = this.machine;
    vm.editable    = this.editable;
    vm.config      = null;
    vm.configName  = null;
    vm.configIndex = null;
    vm.hasError    = false;

    activate();

    //////////

    function activate() {
      $scope.$parent.$watch('vm.configs', configsChanged, true);
      $scope.$watch('vm.machine', machineChanged, true);
      validationMessage.observeMessage().then(null, null, function(message){
        handleMachineConfigError(message);
      });
    }

    function handleMachineConfigError(message){
      if(message.errorStage && message.errorStage === 'machines'){
        message.errorDetails.forEach(function(error) {
          if(error.machineId === vm.machine.machineId){
            vm.hasError = true;
          }
        });
      }
    }

    function configsChanged(configs) {
      vm.configs = configs;
      selectConfig(vm.machine, vm.configs);
    }

    function selectConfig(machine, configs) {

      // find the config from the list of configs
      for(var i = 0; i < configs.length; i++) {
        if(configs[i].configId === machine.configId) {
          vm.config = configs[i];
          vm.configName = vm.config.configName;
          vm.configIndex = i;
          break;
        }
      }
    }

    function machineChanged(machine) {
      vm.machine = machine;
      selectConfig(vm.machine, vm.configs);
    }
  }

}());