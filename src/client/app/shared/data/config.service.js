(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Config', Environment);

  Environment.$inject = [ '$resource' ];
 
  function Environment($resource) {
    return $resource(
      'api/configs/:configId', 
      { configId: '@configId' },
      {
        findByEnv: { method: 'GET',  url: 'api/envs/:envId/configs', isArray: true },
        update   : { method: 'PUT',  url: 'api/configs/:configId' }        
      }
    );
  }

}());