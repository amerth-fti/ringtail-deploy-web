(function() {
  'use strict';

  angular
    .module('app.environments.swarm')
    .directive('swarmService', swarmService);

  function swarmService() {
    return {
      restrict: 'E',
      scope: {
        service: '=',
        tasks: '='
      },
      templateUrl: '/app/environments/swarm/swarm-service.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ ];

  function Controller() {
    var vm               = this;
    vm.service           = this.service;
    vm.getName           = getName;
    vm.getStack          = getStack;
    vm.getDeploymentMode = getDeploymentMode;
    vm.getRunningTasks   = getRunningTasks;
    vm.getDesiredTasks   = getDesiredTasks;
    vm.getEndpointMode   = getEndpointMode;

    activate();

    //////////

    function activate() {

    }

    function getName() {
      let fullname = vm.service.Spec.Name;
      let stack    = getStack();
      return fullname.indexOf(stack) === 0
        ? fullname.substr(stack.length + 1)
        : fullname;
    }

    function getStack() {
      return (vm.service.Spec.Labels && vm.service.Spec.Labels['com.docker.stack.namespace']) || '';
    }

    function getDeploymentMode() {
      return vm.service.Spec.Mode.Replicated
        ? 'Replicated'
        : 'Global';
    }

    function getRunningTasks() {
      return (vm.service.tasks && vm.service.tasks.length) || 0;
    }

    function getDesiredTasks() {
      return vm.service.Spec.Mode.Replicated
        ? vm.service.Spec.Mode.Replicated.Replicas
        : getRunningTasks();
    }

    function getEndpointMode() {
      return vm.service.Endpoint.Spec.Mode === 'vip'
        ? 'Virtual IP'
        : 'DNS Round Robin';
    }

  }

}());