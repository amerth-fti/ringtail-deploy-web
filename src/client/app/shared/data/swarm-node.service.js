(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('SwarmNode', SwarmNode);

  SwarmNode.$inject = [ '$resource' ];

  function SwarmNode($resource) {
      return $resource(
      'api/swarm/nodes/:nodeId',
      { nodeId: '@ID' },
      {
        addLabel    : { method: 'POST', url: 'api/swarm/nodes/labels' },
        removeLabel : { method: 'POST', url: 'api/swarm/nodes/labels/remove' },
      }
    );
  }

}());