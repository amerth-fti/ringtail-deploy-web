(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('method', method);
  
  function method() {
    return { 
      restrict: 'E',
      scope: {
        environment: '='
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
    
    activate();
    
    //////////
    
    function activate() {
    }
  }
  
}());