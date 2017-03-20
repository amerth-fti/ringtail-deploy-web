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
        // map services to task
        vm.deployments.tasks.forEach(task => {
          task.service = vm.deployments.services.find(service => service.ID === task.ServiceID);
        });
        // map tasks to services
        vm.deployments.services.forEach(service => {
          service.tasks = vm.deployments.tasks.filter(task => task.ServiceID === service.ID && validTask(task));
        });
        // map tasks to nodes
        vm.nodes.forEach(node => {
          node.tasks = vm.deployments.tasks.filter(task => task.NodeID === node.ID && validTask(task));
        });
        setTimeout(refreshDeployments, 5000);
      });
    }

    function validTask(task) {
      return task && task.Status.State &&
        (task.Status.State === 'running' || task.Status.State === 'starting' ||
         task.Status.State === 'assigned' || task.Status.State === 'accepted' ||
         task.Status.State === 'preparing' );
    }

    function deploySwarm() {
      var environment = vm.environment;
      Swarm
        .deploy({
          swarmhost: vm.environment.swarmhost,
          accessKeyId: vm.environment.accessKeyId,
          secretAccessKey: vm.environment.secretAccessKey,
        })
        .$promise
        .then(function(res) {

        });
    }

    function getServiceTasks(service) {
      return vm.deployments.tasks.filter(p => p.ServiceID === service.ID);
    }

  }

}());