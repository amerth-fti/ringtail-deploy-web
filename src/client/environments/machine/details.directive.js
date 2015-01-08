(function() {
  'use strict';
  
  angular
    .module('app.environments.machine')
    .directive('machineDetails', machineDetails);
  
  function machineDetails() {
    return { 
      restrict: 'E',
      scope: {
        machine: '=',
        editable: '=?'
      },
      templateUrl: 'client/environments/machine/details.html',
      controller: MachineDetailsController,
      controllerAs: 'vm'
    };
  }
  
  MachineDetailsController.$inject = [ '$scope' ];
  
  function MachineDetailsController($scope) {
    var vm = this;
    vm.machine  = $scope.machine;
    vm.editable = $scope.editable;
    
    activate();
    
    //////////
    
    function activate() {
    }  
  }
  
}());