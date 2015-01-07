(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('envLocalInfo', envLocalInfo);
  
  function envLocalInfo() {
    return { 
      restrict: 'E',
      scope: {
        environment: '='
      },
      templateUrl: 'client/environments/new/s2-local-info.html',
      controller: NewEnvironmentLocalInfoController,
      controllerAs: 'vm'
    };
  }
  
  NewEnvironmentLocalInfoController.$inject = [ '$scope' ];
  
  function NewEnvironmentLocalInfoController($scope) {
    var vm = this;
    vm.environment  = $scope.environment;
    
    activate();
    
    //////////
    
    function activate() {
    }
  }
  
}());