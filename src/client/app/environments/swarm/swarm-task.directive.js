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

  Controller.$inject = [ 'Swarm' ];

  function Controller(Swarm) {
    var vm         = this;
    vm.task        = this.task;
    vm.environemnt = this.environment;

    activate();

    //////////

    function activate() {

    }

  }

}());