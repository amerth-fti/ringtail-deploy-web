(function() {
  'use strict';

  angular
    .module('app.environments.editor')
    .directive('envwizardSwarm', envwizardSwarm);

  function envwizardSwarm() {
    return {
      restrict: 'E',
      scope: {
        cancel: '=',
        environment: '=',
        update: '=',
        trash: '=',
        wizard: '='
      },
      templateUrl: '/app/environments/editor/s8-swarm.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ ];

  function Controller() {
    var vm = this;
    vm.next         = next;
    vm.prev         = prev;

    activate();

    //////////

    function activate() {
    }

    function next() {
      vm.wizard.stage = 'info';
    }

    function prev() {
      vm.wizard.stage = 'method';
    }
  }

}());