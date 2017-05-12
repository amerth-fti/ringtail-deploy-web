(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Swarm', Swarm);

  Swarm.$inject = [ '$resource' ];

  function Swarm($resource) {
      return $resource(
      'api/swarm/nodes/:nodeId',
      { nodeId: '@ID' },
      {
        info            : { method: 'GET',  url: 'api/swarm/info' },
        addLabel        : { method: 'POST', url: 'api/swarm/nodes/labels' },
        removeLabel     : { method: 'POST', url: 'api/swarm/nodes/labels/remove' },
        deployments     : { method: 'GET',  url: 'api/swarm/deploy' },
        deployStack     : { method: 'PUT',  url: 'api/swarm/deploy/stack' },
        deployService   : { method: 'PUT',  url: 'api/swarm/deploy/service' },
        logs            : { method: 'GET',  url: 'api/swarm/logs' },
        managerVersions : { method: 'GET',  url: 'api/swarm/manager/versions', isArray: true },
        updateManager   : { method: 'PUT',  url: 'api/swarm/manager/update' },
      }
    );
  }

}());