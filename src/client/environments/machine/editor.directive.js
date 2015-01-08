(function() {
  'use strict';
  
  angular
    .module('app.environments.machine')
    .directive('machineEditor', machineEditor);
  
  function machineEditor() {
    return { 
      restrict: 'E',
      scope: {
        machine: '=',
      },
      templateUrl: 'client/environments/machine/editor.html',
      controller: MachineEditorController,
      controllerAs: 'vm'
    };
  }
  
  MachineEditorController.$inject = [ '$scope', 'Role' ];
  
  function MachineEditorController($scope, Role) {
    var vm = this;
    vm.machine  = $scope.machine;
    vm.roles    = null;

    activate();
    
    //////////
    
    function activate() {
      vm.roles = Role.query();
    }  
  }
  
}());