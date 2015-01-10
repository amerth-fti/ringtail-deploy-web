(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('envwizardMachines', envwizardMachines);
  
  function envwizardMachines() {
    return { 
      restrict: 'E',
      scope: {
        cancel: '=',
        create: '=',
        environment: '=',
        wizard: '='
      },
      templateUrl: 'client/environments/new/s3-machines.html',
      controller: NewEnvironmentMachinesController,
      controllerAs: 'vm'
    };
  }
  
  NewEnvironmentMachinesController.$inject = [ '$scope', 'MachineEditor' ];
  
  function NewEnvironmentMachinesController($scope, MachineEditor) {
    var vm = this;
    vm.cancel       = $scope.cancel;
    vm.create       = $scope.create;
    vm.environment  = $scope.environment;
    vm.wizard       = $scope.wizard;
    vm.roles        = null;
    vm.addMachine   = addMachine;
    vm.editMachine  = editMachine;
    vm.prev         = prev;
    vm.removeMachine = removeMachine;
    
    activate();
    
    //////////
    
    function activate() {
      vm.machine = {};
      $scope.$watch('environment', function(value) {
        vm.environment = value;
      });
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

    function removeMachine(machine) {
      var index = vm.environment.machines.indexOf(machine);
      vm.environment.machines.splice(index, 1);
    }

    function prev() {
      vm.wizard.stage = 'info';
    }
  }
  
}());