(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('envwizardLocalMachines', envwizardLocalMachines);
  
  function envwizardLocalMachines() {
    return { 
      restrict: 'E',
      scope: {
        cancel: '=',
        environment: '=',
        wizard: '='
      },
      templateUrl: 'client/environments/new/s3-local-machines.html',
      controller: NewEnvironmentLocalMachineController,
      controllerAs: 'vm'
    };
  }
  
  NewEnvironmentLocalMachineController.$inject = [ '$scope' ];
  
  function NewEnvironmentLocalMachineController($scope) {
    var vm = this;
    vm.cancel       = $scope.cancel;
    vm.environment  = $scope.environment;
    vm.wizard       = $scope.wizard;
    vm.machine      = {};
    vm.addMachine   = addMachine;
    vm.create       = create;
    vm.prev         = prev;
    vm.removeMachine = removeMachine;
    
    activate();
    
    //////////
    
    function activate() {
    }

    function addMachine() {
      vm.environment.machines = vm.environment.machines || [];
      vm.environment.machines.push(vm.machine);
      vm.machine = {};
    }

    function removeMachine(machine) {
      var index = vm.environment.machines.indexOf(machine);
      vm.environment.machines.splice(index, 1);
    }

    function create() {
      // do some stuff
    }

    function prev() {
      vm.wizard.stage = 'local-info';
    }
  }
  
}());