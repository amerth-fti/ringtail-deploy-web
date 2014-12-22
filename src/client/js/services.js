
var services = angular.module('services', ['ngResource']);

services.factory('Project', ['$resource', 
  function($resource) {
    return $resource('api/projects/:projectId');
  }]);

services.factory('Environment', ['$resource', 
  function($resource) {
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
    
    return Environment;
  }]);


services.factory('Job', ['$resource',
  function($resource) {
    return $resource(
      'api/jobs/:jobId',
      { jobId: '@id' }      
    );
  }]);


services.factory('DeployInfo', [ function() {
  return function() {
    this.who = '';
    this.until = new Date();
    this.notes = '';
  };
}]);


services.factory('dateHelpers', [ function() {
  return {
    quarterHour: function quarterHour(date) {
      var newDate = new Date(date.getTime());
      var minutes = newDate.getMinutes();
      newDate.setMinutes(Math.round(minutes/15) * 15);
      return newDate;
    },
    addMinutes: function addMinutes(date, minutes) {
      return new Date(date.getTime() + (minutes * 60 * 1000));
    },
    combineDateTime: function combineDateTime(date, time) {
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        0
      );
    }
  };
}]);