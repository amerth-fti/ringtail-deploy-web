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
  
  NewEnvironmentMethodController.$inject = [ '$scope', 'Environment' ];
  
  function NewEnvironmentMethodController($scope, Environment ) {
    var vm = this;
    vm.cancel       = $scope.cancel;
    vm.wizard       = $scope.wizard;    
    vm.selectLocal  = selectLocal;
    vm.selectSkytap = selectSkytap;
    
    activate();
    
    //////////
    
    function activate() {
    }

    function selectLocal() {
      vm.wizard.stage = 'local-info';      
    }

    function selectSkytap() {
      vm.wizard.stage = 'skytap';
    }
  }
  
}());