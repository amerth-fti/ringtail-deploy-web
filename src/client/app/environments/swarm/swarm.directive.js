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
    var vm             = this;
    vm.environment     = this.environment;
    vm.nodes           = [];
    vm.deployments     = { services: [], tasks: [] };
    vm.deploySwarm     = deploySwarm;
    vm.getServiceTasks = getServiceTasks;


    activate();

    //////////

    function activate() {
      vm.nodes = Swarm.query({ swarmhost: vm.environment.swarmhost });
      refreshDeployments();
    }

    function refreshDeployments() {
      Swarm.deployments({ swarmhost: vm.environment.swarmhost }).$promise.then((deployments) => {
        vm.deployments = deployments;
        // map tasks to services
        vm.deployments.services.forEach(service => {
          service.tasks = vm.deployments.tasks.filter(task => task.ServiceID === service.ID);
        });
        // map tasks to nodes
        setTimeout(refreshDeployments, 5000);
      });
    }

    function deploySwarm() {
      var environment = vm.environment;
      Swarm
        .deploy({ swarmhost: vm.environment.swarmhost })
        .$promise
        .then(function(res) {

        });
    }

    function getServiceTasks(service) {
      return vm.deployments.tasks.filter(p => p.ServiceID === service.ID);
    }

  }

}());