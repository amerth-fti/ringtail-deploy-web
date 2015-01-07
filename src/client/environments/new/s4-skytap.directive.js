(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('envwizardSkytap', envwizardSkytap);
  
  function envwizardSkytap() {
    return { 
      restrict: 'E',
      scope: {
        cancel: '=',
        environment: '=',
        wizard: '=',
      },
      templateUrl: 'client/environments/new/s4-skytap.html',
      controller: NewEnvironmentSkytapController,
      controllerAs: 'vm'
    };
  }
  
  NewEnvironmentSkytapController.$inject = [ '$scope' ];
  
  function NewEnvironmentSkytapController($scope) {
    var vm = this;
    vm.environment  = $scope.environment;
    vm.wizard       = $scope.wizard;
    vm.create       = create;
    vm.prev         = prev;
    
    activate();
    
    //////////
    
    function activate() {
    }

    function create() {
      // do something  
    }

    function prev() {
      vm.wizard.stage = 'method';
    }
  }
  
}());