(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('SkydemoSession', SkydemoSession);

  SkydemoSession.$inject = [ '$resource' ];
 
  function SkydemoSession($resource) {
    return $resource(
      'api/session', {}, {
          query: {method: 'GET', isArray: false}
      }
    );
  }

}());