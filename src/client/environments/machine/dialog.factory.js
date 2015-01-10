(function() {
  'use strict';
  
  angular
    .module('app.environments.machine')
    .factory('MachineEditor', MachineEditor);
  
  MachineEditor.$inject = [ '$modal' ];
  
  function MachineEditor($modal) {    
    return {
      open: open
    };

    function open(machine) {
      return $modal.open({
        templateUrl: 'client/environments/machine/dialog.html',
        controller: MachineEditorController,
        controllerAs: 'vm',
        resolve: {
          machine: function() {
            return machine;
          }
        }
      });
    }
  }

  MachineEditorController.$inject = [ '$scope', '$modalInstance', 'machine' ];

  function MachineEditorController($scope, $modalInstance, machine) {
    var vm    = this;
    vm.machine  = machine || {};
    vm.mode     = activate;
    vm.cancel   = cancel;
    vm.submit   = submit;

    activate();

    //////////

    function activate() {
      vm.mode = vm.machine ? 'edit' : 'create';
    }


    function cancel() {
      $modalInstance.dismiss();
    }

    function submit() {
      $scope.machine = angular.copy(vm.machine, $scope.machine);      
      $modalInstance.close($scope.machine);
    }
    
  }
  
}());