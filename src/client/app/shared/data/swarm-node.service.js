(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('SwarmNode', SwarmNode);

  SwarmNode.$inject = [ '$resource' ];

  function SwarmNode($resource) {
      return $resource(
      'api/swarm/nodes/:nodeId',
      { nodeId: '@ID' }
    );
  }

}());