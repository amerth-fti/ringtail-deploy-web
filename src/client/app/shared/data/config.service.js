(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Config', Config);

  Config.$inject = [ '$resource' ];

  function Config($resource) {
    return $resource(
      'api/configs/:configId',
      { configId: '@configId' },
      {
        findByEnv: { method: 'GET',  url: 'api/envs/:envId/configs', isArray: true },
        launchKeys: { method: 'GET',  url: 'api/envs/:envId/branches/:branch/launchKeys', isArray: true },
        update   : { method: 'PUT',  url: 'api/configs/:configId' }
      }
    );
  }

}());