'use strict';

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
        start   : { method: 'PUT', url: 'api/environments/:environmentId/start' },
        pause   : { method: 'PUT', url: 'api/environments/:environmentId/pause' },
        redeploy: { method: 'PUT', url: 'api/environments/:environmentId/redeploy' }
      }
    );
  }]);


services.factory('Task', ['$resource',
  function($resource) {
    return $resource(
      'api/tasks/:taskId',
      { taskId: '@id' }      
    );
  }]);