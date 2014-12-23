(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Job', Job);

  Job.$inject = [ '$resource' ];
 
  function Job($resource) {
    return $resource(
      'api/jobs/:jobId',
      { jobId: '@id' },
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