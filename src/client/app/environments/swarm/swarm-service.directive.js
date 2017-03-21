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
    vm.showDetails       = false;
    vm.getDeploymentMode = getDeploymentMode;
    vm.getRunningTasks   = getRunningTasks;
    vm.getDesiredTasks   = getDesiredTasks;
    vm.getEndpointMode   = getEndpointMode;
    vm.getStatus         = getStatus;
    vm.toggleDetails     = toggleDetails;

    activate();

    //////////

    function activate() {

    }

    function getDeploymentMode() {
      return vm.service.Spec.Mode.Replicated
        ? 'Replicated'
        : 'Global';
    }

    function getRunningTasks() {
      return (vm.service.tasks && vm.service.tasks.filter(task => task.Status.State === 'running').length) || 0;
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

    function getStatus() {
      return getRunningTasks() > 0 ? 'running': 'pending';
    }

    function toggleDetails() {
      vm.showDetails = !vm.showDetails;
    }

  }

}());