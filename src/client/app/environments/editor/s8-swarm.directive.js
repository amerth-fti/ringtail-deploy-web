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
        configs: '=',
        update: '=',
        wizard: '='
      },
      templateUrl: '/app/environments/editor/s8-swarm.html',
      controller: NewEnvironmentSwarmController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  NewEnvironmentSwarmController.$inject = [ 'SwarmNode' ];

  function NewEnvironmentSwarmController(SwarmNode) {
    var vm         = this;
    vm.environment = this.environment;
    vm.next        = next;
    vm.prev        = prev;
    vm.nodes       = [];

    activate();

    //////////

    function activate() {
      vm.nodes = SwarmNode.query({ swarmhost: vm.environment.swarmhost });
    }

    function next() {
      vm.wizard.stage = 'validation';
    }

    function prev() {
      vm.wizard.stage = 'taskdefs';
    }
  }

}());