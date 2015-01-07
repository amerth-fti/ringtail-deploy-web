(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('method', method);
  
  function method() {
    return { 
      restrict: 'E',
      scope: {
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
    vm.environment  = $scope.environment;
    vm.wizard       = $scope.wizard;
    vm.select       = select;
    
    activate();
    
    //////////
    
    function activate() {
    }

    function select(method) {
      if(method === 'local') {
        vm.environment.remoteType = null;
        vm.wizard.stage = 'local-info';
      } else if (method === 'skytap') {
        vm.environment.remoteType = 'skytap';
        vm.wizard.stage = 'skytap';
      }
    }
  }
  
}());