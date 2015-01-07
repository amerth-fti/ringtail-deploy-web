(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('envwizardMethod', envwizardMethod);
  
  function envwizardMethod() {
    return { 
      restrict: 'E',
      scope: {
        cancel: '=',
        environment: '=',
        wizard: '='   
      },
      templateUrl: 'client/environments/new/s1-method.html',
      controller: NewEnvironmentMethodController,
      controllerAs: 'vm'
    };
  }
  
  NewEnvironmentMethodController.$inject = [ '$scope' ];
  
  function NewEnvironmentMethodController($scope) {
    var vm = this;
    vm.cancel       = $scope.cancel;
    vm.environment  = $scope.environment;
    vm.wizard       = $scope.wizard;    
    vm.selectLocal  = selectLocal;
    vm.selectSkytap = selectSkytap;
    
    activate();
    
    //////////
    
    function activate() {
      console.log(vm.cancel);
    }

    function selectLocal() {
      vm.environment.remoteType = null;
      vm.wizard.stage = 'local-info';
    }

    function selectSkytap() {
      vm.environment.remoteType = 'skytap';
      vm.wizard.stage = 'skytap';
    }
  }
  
}());