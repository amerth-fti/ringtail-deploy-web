(function() {
  'use strict';
  
  angular
    .module('app.environments.editor')
    .directive('envwizardMachines', envwizardMachines);
  
  function envwizardMachines() {
    return { 
      restrict: 'E',
      scope: {
        cancel: '=',
        environment: '=',
        update: '=',
        wizard: '='
      },
      templateUrl: '/app/environments/editor/s4-machines.html',
      controller: NewEnvironmentMachinesController,
      controllerAs: 'vm',
      bindToController: true
    };
  }
  
  NewEnvironmentMachinesController.$inject = [ 'MachineEditor' ];
  
  function NewEnvironmentMachinesController(MachineEditor) {
    var vm            = this;
    vm.roles          = null;
    vm.addMachine     = addMachine;
    vm.editMachine    = editMachine;
    vm.next           = next;
    vm.prev           = prev;
    vm.removeMachine  = removeMachine;
    
    activate();
    
    //////////
    
    function activate() {
      vm.machine = {};
    }

    function addMachine() {
      var opts = { 
        remoteType: vm.environment.remoteType
      };
      MachineEditor.open(null, opts)
      .result
      .then(function(result) {
        vm.environment.machines = vm.environment.machines || [];
        vm.environment.machines.push(result);
      });
    }

    function editMachine(machine) {
      var opts = { 
        remoteType: vm.environment.remoteType
      };
      MachineEditor.open(machine, opts);
    }

    function next() {
      vm.wizard.stage = 'taskdefs';
    }

    function prev() {
      vm.wizard.stage = 'info';
    }

    function removeMachine(machine) {
      var index = vm.environment.machines.indexOf(machine);
      vm.environment.machines.splice(index, 1);
    }
  }
  
}());