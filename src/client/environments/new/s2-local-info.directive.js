(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('envwizardLocalInfo', envwizardLocalInfo);
  
  function envwizardLocalInfo() {
    return { 
      restrict: 'E',
      scope: {        
        cancel: '=',
        environment: '=',
        wizard: '='
      },
      templateUrl: 'client/environments/new/s2-local-info.html',
      controller: NewEnvironmentLocalInfoController,
      controllerAs: 'vm'
    };
  }
  
  NewEnvironmentLocalInfoController.$inject = [ '$scope' ];
  
  function NewEnvironmentLocalInfoController($scope) {
    var vm = this;
    vm.cancel       = $scope.cancel;
    vm.environment  = $scope.environment;
    vm.wizard       = $scope.wizard;
    vm.next         = next;
    vm.prev         = prev;
    
    activate();
    
    //////////
    
    function activate() {
    }

    function next() {
      vm.wizard.stage = 'local-machines';      
    }

    function prev() {
      vm.wizard.stage = 'method';
    }
  }
  
}());