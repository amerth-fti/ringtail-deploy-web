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
        info          : { method: 'GET',  url: 'api/swarm/info' },
        addLabel      : { method: 'POST', url: 'api/swarm/nodes/labels' },
        removeLabel   : { method: 'POST', url: 'api/swarm/nodes/labels/remove' },
        deploy        : { method: 'PUT',  url: 'api/swarm/deploy' },
        deployments   : { method: 'GET',  url: 'api/swarm/deploy' },
        deployService : { method: 'PUT',  url: 'api/swarm/deployService' },
        logs          : { method: 'GET',  url: 'api/swarm/logs' },
      }
    );
  }

}());