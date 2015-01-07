(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('envLocalMachines', envLocalMachines);
  
  function envLocalMachines() {
    return { 
      restrict: 'E',
      scope: {
        environment: '='
      },
      templateUrl: 'client/environments/new/s3-local-machines.html',
      controller: NewEnvironmentLocalMachineController,
      controllerAs: 'vm'
    };
  }
  
  NewEnvironmentLocalMachineController.$inject = [ '$scope' ];
  
  function NewEnvironmentLocalMachineController($scope) {
    var vm = this;
    vm.environment  = $scope.environment;
    
    activate();
    
    //////////
    
    function activate() {
    }
  }
  
}());