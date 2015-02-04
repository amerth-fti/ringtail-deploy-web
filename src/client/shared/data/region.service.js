(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Region', Region);

  Region.$inject = [ '$resource' ];
 
  function Region($resource) {
    return $resource(
      'api/regions/:regionId', 
      { regionId: '@regionId', envId: '@envId' },
      {
        update: { method: 'PUT', url: 'api/regions/:regionId' },
        addEnv: { method: 'POST', url: 'api/regions/:regionId/envs/:envId' }
      }
    );
  }

}());