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
      templateUrl: '/app/environments/new/s1-method.html',
      controller: NewEnvironmentMethodController,
      controllerAs: 'vm',
      bindToController: true
    };
  }
  
  NewEnvironmentMethodController.$inject = [ 'Environment' ];
  
  function NewEnvironmentMethodController(Environment ) {
    var vm = this;
    vm.selectLocal  = selectLocal;
    vm.selectSkytap = selectSkytap;
    
    activate();
    
    //////////
    
    function activate() {
    }

    function selectLocal() {
      vm.environment = new Environment();
      vm.environment.remoteType = null;
      vm.wizard.stage = 'info';      
    }

    function selectSkytap() {
      vm.environment = new Environment();
      vm.environment.remoteType = 'skytap';
      vm.wizard.stage = 'skytap';
    }
  }
  
}());