(function() {
  'use strict';
  
  angular
    .module('app.environments.config')
    .directive('configEditor', configEditor);
  
  function configEditor() {
    return { 
      restrict: 'E',
      scope: {
        machine: '=',
        remoteType: '='
      },
      templateUrl: '/app/environments/config/editor.html',
      controller: Controller,
      controllerAs: 'vm'
    };
  }
  
  Controller.$inject = [ '$scope', 'Role' ];
  
  function Controller($scope, Role) {
    var vm = this;
    vm.machine    = $scope.machine;
    vm.remoteType = $scope.remoteType;
    vm.roles      = null;

    activate();
    
    //////////

    function activate() {
      vm.roles = Role.query({ remoteType: vm.remoteType });
    }
  }
  
}());