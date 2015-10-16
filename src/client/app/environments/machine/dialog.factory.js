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

    function open(configs, machine, opts) {
      return $modal.open({
        templateUrl: '/app/environments/machine/dialog.html',
        controller: MachineEditorController,
        controllerAs: 'vm',
        resolve: {
          configs: function() {
            return configs;
          },
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

  MachineEditorController.$inject = [ '$scope', '$modalInstance', 'configs', 'machine', 'options' ];

  function MachineEditorController($scope, $modalInstance, configs, machine, options) {
    var vm      = this;
    vm.configs  = configs;
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