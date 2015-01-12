(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Environment', Environment);

  Environment.$inject = [ '$resource' ];
 
  function Environment($resource) {
    return $resource(
      'api/envs/:envId', 
      { envId: '@envId' },
      {
        update  : { method: 'PUT', url: 'api/envs/:envId' },
        start   : { method: 'PUT', url: 'api/envs/:envId/start' },
        pause   : { method: 'PUT', url: 'api/envs/:envId/pause' },
        redeploy: { method: 'PUT', url: 'api/envs/:envId/redeploy' },
        reset   : { method: 'PUT', url: 'api/envs/:envId/reset' }
      }
    );
  }

}());