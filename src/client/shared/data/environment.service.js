(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Environment', Environment);

  Environment.$inject = [ '$resource' ];
 
  function Environment($resource) {
    return $resource(
      'api/environments/:environmentId', 
      { environmentId: '@id' }, 
      {
        project : { method: 'GET', url: 'api/projects/:projectId/environments', isArray: true },
        get     : { method: 'GET', url: 'api/environments/:environmentId', transformResponse: parse },
        update  : { method: 'PUT', url: 'api/environments/:environmentId', transformResponse: parse },              
        start   : { method: 'PUT', url: 'api/environments/:environmentId/start', transformResponse: parse },
        pause   : { method: 'PUT', url: 'api/environments/:environmentId/pause', transformResponse: parse },
        redeploy: { method: 'PUT', url: 'api/environments/:environmentId/redeploy', transformResponse: parse }
      }
    );
    
    function parse(data) {
      var environment = JSON.parse(data);
      try
      {        
        environment.deployment = JSON.parse(environment.user_data.contents);
        environment.deployment.status = environment.deployment.status || 'deployed';        
      }
      catch (ex) {  
        environment.deployment = {};
        environment.deployment.status = 'initialize';        
      }
      environment.show = environment.deployment.status !== 'hidden'; 
      return environment;
    }
  }

}());