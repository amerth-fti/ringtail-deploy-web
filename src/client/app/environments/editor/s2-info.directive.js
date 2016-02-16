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
      vm.wizard.stage = 'configs';
    }

    function prev() {
      vm.wizard.stage = 'method';
    }
  }

}());