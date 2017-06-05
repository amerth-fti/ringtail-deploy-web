(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Validation', Validation);

  Validation.$inject = [ '$resource' ];
 
  function Validation($resource) {
    return $resource(
      'api/validations/:validationId',
      { validationId: '@id' },
      {
        get: { method: 'GET', transformResponse: parse } 
      }
    );
    
    function parse(data) {
      var job = JSON.parse(data);
      job.elapsed = (job.stopped ? new Date(job.stopped) : new Date()) - new Date(job.started);
      return job;
    }
  }

}());