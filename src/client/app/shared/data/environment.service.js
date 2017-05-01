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
        validate: { method: 'GET', url: 'api/envs/:envId/validate' },
        reset   : { method: 'PUT', url: 'api/envs/:envId/reset' },
        remove  : { method: 'DELETE', url: 'api/envs/:envId' },
        region  : { method: 'GET', url: 'api/regions/:regionId/envs', isArray: true }
      }
    );
  }

}());