(function() {
  'use strict';

  angular
    .module('app.swarm')
    .directive('swarmDetails', swarmDetails);

  function swarmDetails() {
    return {
      restrict: 'E',
      scope: {
        envId: '='
      },
      templateUrl: '/app/swarm/details.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ '$scope', 'Environment', 'Swarm' ];

  function Controller($scope, Environment, Swarm) {
    var vm             = this;
    var refreshTimeout = 10000;
    var timeout        = null;
    vm.envId           = vm.envId;
    vm.environment     = null;
    vm.nodes           = [];
    vm.info            = { stacks: [], roles: [] };
    vm.deployments     = { services: [], tasks: [] };
    vm.getServiceTasks = getServiceTasks;

    activate();

    //////////

    function activate() {
      vm.environment = Environment.get({ envId: vm.envId }, function() {
        fetchStatus();
        refreshDeployments();
      });
    }

    function fetchStatus() {
      $scope.$on('deploy_started', onDeployStart);
      $scope.$on('deploy_completed', onDeployComplete);
      vm.info  = Swarm.info({ swarmhost: vm.environment.swarmhost });
      vm.nodes = Swarm.query({ swarmhost: vm.environment.swarmhost });
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

    function onDeployStart() {
      console.log('started');
      clearTimeout(timeout);
      refreshTimeout = 1000;
      refreshDeployments();
    }

    function onDeployComplete() {
      console.log('completed');
      clearTimeout(timeout);
      refreshTimeout = 10000;
      refreshDeployments();
    }

  }

}());