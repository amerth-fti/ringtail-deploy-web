(function() {
  'use strict';

  angular
    .module('app.environments.swarm')
    .directive('swarmTask', swarmTask);

  function swarmTask() {
    return {
      restrict: 'E',
      scope: {
        environment: '=',
        task: '='
      },
      templateUrl: '/app/environments/swarm/swarm-task.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ 'Swarm', 'SwarmLogs' ];

  function Controller(Swarm, SwarmLogs) {
    var vm         = this;
    vm.task        = this.task;
    vm.environemnt = this.environment;
    vm.viewLogs    = viewLogs;

    activate();

    //////////

    function activate() {

    }

    function viewLogs() {
      SwarmLogs.open(vm.environment, vm.task);
    }

  }

}());