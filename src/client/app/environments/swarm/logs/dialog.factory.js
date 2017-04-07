(function() {
  'use strict';

  angular
    .module('app.environments.swarm.logs')
    .factory('SwarmLogs', SwarmLogs);

  SwarmLogs.$inject = [ '$modal' ];

  function SwarmLogs($modal) {
    return {
      open: open
    };

    function open(environment, task) {
      return $modal.open({
        size: 'lg',
        backdrop: false,
        templateUrl: '/app/environments/swarm/logs/dialog.html',
        controller: Controller,
        controllerAs: 'vm',
        resolve: {
          environment: function() {
            return environment;
          },
          task: function() {
            return task;
          }
        }
      });
    }
  }

  Controller.$inject = [ '$modalInstance', 'Swarm', 'environment', 'task' ];

  function Controller($modalInstance, Swarm, environment, task) {
    var vm         = this;
    vm.environment = environment;
    vm.task        = task;
    vm.logs        = {};
    vm.close       = close;
    vm.loading     = false;
    vm.refresh     = refresh;

    activate();

    //////////

    function activate() {
      load();
    }

    function load() {
      vm.loading = true;
      Swarm.logs({ swarmhost: environment.swarmhost, service: task.service.Spec.Name })
      .$promise.then(function (result) {
        vm.logs = result[task.ID] || {};
        vm.loading = false;
      });
    }

    function close() {
      $modalInstance.dismiss();
    }

    function refresh() {
      load();
    }
  }

}());