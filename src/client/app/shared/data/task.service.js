(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Task', Task);

  Task.$inject = [ '$resource' ];
 
  function Task($resource) {
      return $resource(
      'api/tasks/:taskId',
      { taskId: '@id' }
    );
  }

}());