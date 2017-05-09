(function() {
  'use strict';

  angular
    .module('app.swarm.update')
    .factory('SwarmUpdate', SwarmUpdate);

  SwarmUpdate.$inject = [ '$modal' ];

  function SwarmUpdate($modal) {
    return {
      open: open
    };

    function open(environment, version) {
      return $modal.open({
        size: 'lg',
        backdrop: false,
        templateUrl: '/app/swarm/update/dialog.html',
        controller: Controller,
        controllerAs: 'vm',
        resolve: {
          version: function() {
            return version;
          },
          environment: function() {
            return environment;
          }
        }
      });
    }
  }

  Controller.$inject = [ '$modalInstance', 'Swarm', 'environment', 'version' ];

  function Controller($modalInstance, Swarm, environment, version) {
    var vm         = this;
    vm.environment = environment;
    vm.version     = undefined;
    vm.versions    = null;
    vm.update      = update;
    vm.close       = close;

    activate();

    //////////

    function activate() {
      load();
    }

    function load() {
      vm.versions = Swarm.managerVersions({ swarmhost: environment.swarmhost, accessKeyId: environment.accessKeyId, secretAccessKey: environment.secretAccessKey });
    }

    function update() {
      console.log('updating to ' + vm.version);
      Swarm.updateManager({ swarmhost: environment.swarmhost, accessKeyId: environment.accessKeyId, secretAccessKey: environment.secretAccessKey, version: vm.version })
      .$promise.then(function() {
        $modalInstance.close(vm.version);
      });
    }

    function close() {
      $modalInstance.dismiss();
    }
  }

}());