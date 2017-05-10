(function() {
  'use strict';

  angular
    .module('app.swarm')
    .directive('swarmService', swarmService);

  function swarmService() {
    return {
      restrict: 'E',
      scope: {
        environment: '=',
        service: '=',
        tasks: '='
      },
      templateUrl: '/app/swarm/swarm-service.html',
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
    vm.getDeploymentMode = getDeploymentMode;
    vm.getRunningTasks   = getRunningTasks;
    vm.getDesiredTasks   = getDesiredTasks;
    vm.getEndpointMode   = getEndpointMode;
    vm.getStatus         = getStatus;
    vm.getImage          = getImage;
    vm.getImageVersion   = getImageVersion;
    vm.getShaHash        = getShaHash;
    vm.showTaskDetails   = false;
    vm.toggleTaskDetails = toggleTaskDetails;
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

    function getImage() {
      let image = vm.service.Spec.TaskTemplate.ContainerSpec.Image.split('@')[0].split(':')[0];
      let pathIndex = image.indexOf('/');
      return image.substr(pathIndex + 1);
    }

    function getImageVersion() {
      return vm.service.Spec.TaskTemplate.ContainerSpec.Image.split('@')[0].split(':')[1];
    }

    function getShaHash() {
      let hash = vm.service.Spec.TaskTemplate.ContainerSpec.Image.split('@')[0];
      return hash.replace('sha256:', '').substr(0, 16);
    }

    function getEndpointMode() {
      return vm.service.Endpoint.Spec.Mode === 'vip'
        ? 'Virtual IP'
        : 'DNS Round Robin';
    }

    function getStatus() {
      return getRunningTasks() > 0 ? 'running': 'pending';
    }

    function toggleTaskDetails() {
      vm.showTaskDetails = !vm.showTaskDetails;
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
      })
      .catch(function(res) {
        $scope.$emit('deploy_completed', eventData);
        vm.redeploying = false;
        setTimeout(alert('Deployment failed with ' + res.statusText));
      });
    }

    function viewLogs(task) {
      SwarmLogs.open(vm.environment, task);
    }

  }

}());