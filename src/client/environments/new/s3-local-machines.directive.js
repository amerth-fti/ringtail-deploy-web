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
  
  NewEnvironmentLocalMachineController.$inject = [ '$scope', 'MachineEditor' ];
  
  function NewEnvironmentLocalMachineController($scope, MachineEditor) {
    var vm = this;
    vm.cancel       = $scope.cancel;
    vm.environment  = $scope.environment;
    vm.wizard       = $scope.wizard;
    vm.roles        = null;
    vm.addMachine   = addMachine;    
    vm.create       = create;
    vm.editMachine  = editMachine;
    vm.prev         = prev;
    vm.removeMachine = removeMachine;
    
    activate();
    
    //////////
    
    function activate() {
      vm.machine = {};
    }

    function newMachine() {

    }

    function addMachine() {
      MachineEditor.open(null)
      .result
      .then(function(result) {
        vm.environment.machines = vm.environment.machines || [];
        vm.environment.machines.push(result);
      });
    }

    function editMachine(machine) {
      MachineEditor.open(machine);
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