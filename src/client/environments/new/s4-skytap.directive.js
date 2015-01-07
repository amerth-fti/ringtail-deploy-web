(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('envSkytap', envSkytap);
  
  function envSkytap() {
    return { 
      restrict: 'E',
      scope: {
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
    
    activate();
    
    //////////
    
    function activate() {
    }
  }
  
}());