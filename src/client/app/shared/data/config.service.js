(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Config', Environment);

  Environment.$inject = [ '$resource' ];
 
  function Environment($resource) {
    return $resource(
      'api/configs/:configId', 
      null,      
      {
        findByEnv: { method: 'GET', url: 'api/envs/:envId/configs', isArray: true },
        update  : { method: 'PUT', url: 'api/config/:configId' }
      }
    );
  }

}());