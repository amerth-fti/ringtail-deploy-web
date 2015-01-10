(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('envwizardInfo', envwizardInfo);
  
  function envwizardInfo() {
    return { 
      restrict: 'E',
      scope: {        
        cancel: '=',
        environment: '=',
        wizard: '='
      },
      templateUrl: 'client/environments/new/s2-info.html',
      controller: NewEnvironmentInfoController,
      controllerAs: 'vm'
    };
  }
  
  NewEnvironmentInfoController.$inject = [ '$scope' ];
  
  function NewEnvironmentInfoController($scope) {
    var vm = this;
    vm.cancel       = $scope.cancel;
    vm.environment  = null;
    vm.wizard       = $scope.wizard;
    vm.next         = next;
    vm.prev         = prev;
    
    activate();
    
    //////////
    
    function activate() {
      $scope.$watch('environment', function(value) {
        vm.environment = value;
      });
    }

    function next() {
      vm.wizard.stage = 'machines';      
    }

    function prev() {
      vm.wizard.stage = 'method';
    }
  }
  
}());