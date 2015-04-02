(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Browse', Browse);

  Browse.$inject = [ '$resource' ];
 
  function Browse($resource) {
    return $resource(
      'api/regions/:regionId',
      null,
      {
        branches: { method: 'GET', url: 'api/regions/:regionId/branches', isArray: true },
        builds:   { method: 'GET', url: 'api/regions/:regionId/branches/:branch/builds', isArray: true }
      }
    );      
  }

}());