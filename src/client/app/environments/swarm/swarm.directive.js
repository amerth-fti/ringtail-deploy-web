(function() {
  'use strict';

  angular
    .module('app.environments.swarm')
    .directive('envSwarm', envSwarm);

  function envSwarm() {
    return {
      restrict: 'E',
      scope: {
        environment: '='
      },
      templateUrl: '/app/environments/swarm/swarm.html',
      controller: SwarmController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  SwarmController.$inject = [ 'Swarm' ];

  function SwarmController(Swarm) {
    var vm         = this;
    vm.environment = this.environment;
    vm.nodes       = [];
    vm.deploySwarm = deploySwarm;

    activate();

    //////////

    function activate() {
      vm.nodes = Swarm.query({ swarmhost: vm.environment.swarmhost });
    }

    function deploySwarm() {
      var environment = vm.environment;
      Swarm
        .deploy({ swarmhost: vm.environment.swarmhost })
        .promise
        .then(function() {
          // indicate that deployment has started...
        });
    }

  }

}());