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

    function open(machine, opts) {
      return $modal.open({
        templateUrl: 'client/environments/machine/dialog.html',
        controller: MachineEditorController,
        controllerAs: 'vm',
        resolve: {
          machine: function() {
            return machine;
          },
          options: function() {
            return opts;
          }
        }
      });
    }
  }

  MachineEditorController.$inject = [ '$scope', '$modalInstance', 'machine', 'options' ];

  function MachineEditorController($scope, $modalInstance, machine, options) {
    var vm    = this;
    vm.machine  = machine || {};
    vm.mode     = null;
    vm.options  = options;
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