(function() {
  'use strict';

  angular
    .module('app.environments.swarm')
    .directive('swarmService', swarmService);

  function swarmService() {
    return {
      restrict: 'E',
      scope: {
        environment: '=',
        service: '=',
        tasks: '='
      },
      templateUrl: '/app/environments/swarm/swarm-service.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ '$scope', 'Swarm', 'SwarmLogs' ];

  function Controller($scope, Swarm, SwarmLogs) {
    var vm               = this;
    vm.environment       = this.environment;
    vm.service           = this.service;
    vm.showDetails       = true;
    vm.getDeploymentMode = getDeploymentMode;
    vm.getRunningTasks   = getRunningTasks;
    vm.getDesiredTasks   = getDesiredTasks;
    vm.getEndpointMode   = getEndpointMode;
    vm.getStatus         = getStatus;
    vm.toggleDetails     = toggleDetails;
    vm.redeploy          = redeploy;
    vm.redeploying       = false;
    vm.viewLogs          = viewLogs;

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

    function redeploy() {
      let eventData = { type: 'service', id: vm.service.ID };
      $scope.$emit('deploy_started', eventData);
      vm.redeploying = true;
      Swarm.deployService({
        swarmhost: vm.environment.swarmhost,
        accessKeyId: vm.environment.accessKeyId,
        secretAccessKey: vm.environment.secretAccessKey,
        service: vm.service.Spec.Name
      })
      .$promise
      .then(function(res) {
        $scope.$emit('deploy_completed', eventData);
        vm.redeploying = false;
      });
    }

    function viewLogs(task) {
      SwarmLogs.open(vm.environment, task);
    }

  }

}());