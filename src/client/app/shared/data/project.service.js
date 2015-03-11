(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Project', Project);

  Project.$inject = [ '$resource' ];
 
  function Project($resource) {
    return $resource('api/projects/:projectId');
  }

}());