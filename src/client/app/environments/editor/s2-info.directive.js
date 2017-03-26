(function() {
  'use strict';

  angular
    .module('app.environments.editor')
    .directive('envwizardInfo', envwizardInfo);

  function envwizardInfo() {
    return {
      restrict: 'E',
      scope: {
        cancel: '=',
        environment: '=',
        update: '=',
        trash: '=',
        wizard: '='
      },
      templateUrl: '/app/environments/editor/s2-info.html',
      controller: NewEnvironmentInfoController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  NewEnvironmentInfoController.$inject = [ ];

  function NewEnvironmentInfoController() {
    var vm = this;
    vm.next         = next;
    vm.prev         = prev;

    activate();

    //////////

    function activate() {
    }

    function next() {
      if(!vm.environment.envName || vm.environment.envName.trim().length == 0){
        debugger;
        vm.environment.errorName = 'name required';
        return;
      } else {
        vm.environment.errorName = '';
      }

      if(!vm.environment.host || vm.environment.host.trim().length == 0){
        vm.environment.errorHost = 'host required';
        return;
      } else {
        vm.environment.errorHost = '';
      }

      vm.wizard.stage = 'swarm';
    }

    function prev() {
      vm.wizard.stage = 'method';
    }
  }

}());