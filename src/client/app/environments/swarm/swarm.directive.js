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
    var refreshTimeout = 10000;
    var timeout        = null;
    vm.deploying       = false;
    vm.environment     = this.environment;
    vm.nodes           = [];
    vm.info            = { stacks: [], roles: [] };
    vm.deployments     = { services: [], tasks: [] };
    vm.deploySwarm     = deploySwarm;
    vm.getServiceTasks = getServiceTasks;

    activate();

    //////////

    function activate() {
      vm.info  = Swarm.info({ swarmhost: vm.environment.swarmhost });
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
          service.name = getName(service);
          service.stack = getStack(service);
          service.tasks = vm.deployments.tasks.filter(task => task.ServiceID === service.ID && validTask(task));
          service.failedTasks = vm.deployments.tasks
            .filter(task => task.ServiceID === service.ID && !validTask(task))
            .sort((t1, t2) => t2.UpdatedAt > t1.UpdatedAt);
        });
        // map tasks to nodes
        vm.nodes.forEach(node => {
          node.tasks = vm.deployments.tasks.filter(task => task.NodeID === node.ID && validTask(task));
        });
        // map services to stacks
        vm.info.stacks.forEach(stack => {
          stack.services = vm.deployments.services.filter(service => service.stack === stack.id);
          stack.running = stack.services.length > 0 && stack.services.every(service => hasRunningTask(service));
        });
        // poll again shortly...
        timeout = setTimeout(refreshDeployments, refreshTimeout);
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
      clearTimeout(timeout);
      refreshTimeout = 1000;
      refreshDeployments();
      vm.deploying = true;
      Swarm
        .deploy({
          swarmhost: vm.environment.swarmhost,
          accessKeyId: vm.environment.accessKeyId,
          secretAccessKey: vm.environment.secretAccessKey,
        })
        .$promise
        .then(function(res) {
          refreshTimeout = 10000;
          vm.deploying = false;
          clearTimeout(timeout);
          refreshDeployments();
        });
    }

    function getServiceTasks(service) {
      return vm.deployments.tasks.filter(p => p.ServiceID === service.ID);
    }

    function getStack(service) {
      return (service.Spec.Labels && service.Spec.Labels['com.docker.stack.namespace']) || '';
    }

    function getName(service) {
      let fullname = service.Spec.Name;
      let stack    = getStack(service);
      let name = fullname.indexOf(stack) === 0
        ? fullname.substr(stack.length + 1)
        : fullname;
      return name;
    }

    function hasRunningTask(service) {
      return service.tasks.some(task => task.Status.State === 'running');
    }

  }

}());