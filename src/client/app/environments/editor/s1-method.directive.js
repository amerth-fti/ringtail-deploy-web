(function() {
  'use strict';

  angular
    .module('app.environments.editor')
    .directive('envwizardMethod', envwizardMethod);

  function envwizardMethod() {
    return {
      restrict: 'E',
      scope: {
        cancel: '=',
        environment: '=',
        wizard: '='
      },
      templateUrl: '/app/environments/editor/s1-method.html',
      controller: NewEnvironmentMethodController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  NewEnvironmentMethodController.$inject = [ ];

  function NewEnvironmentMethodController() {
    var vm = this;
    vm.selectLocal  = selectLocal;
    vm.selectSkytap = selectSkytap;

    activate();

    //////////

    function activate() {
    }

    function selectLocal() {
      vm.environment.remoteType = null;
      vm.wizard.stage = 'info';
    }

    function selectSkytap() {
      vm.environment.remoteType = 'skytap';
      vm.wizard.stage = 'skytap';
    }
  }

}());