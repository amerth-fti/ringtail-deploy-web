(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('SkytapEnvironment', SkytapEnvironment);

  SkytapEnvironment.$inject = [ '$resource' ];
 
  function SkytapEnvironment($resource) {
    return $resource('api/skytap/environments/:id',
      { id: '@id' },
      { }
    );
  }

}());