'use strict';

var services = angular.module('services', ['ngResource']);

services.factory('Project', ['$resource', 
  function($resource) {
    return $resource('api/projects/:projectId', {}, {
      query: { method: 'GET', isArray: true }
    });
  }]);

services.factory('Environment', ['$resource', 
  function($resource) {
    return $resource(
      'api/environments/:environmentId', 
      { environmentId: '@id' }, 
      {
        project: { method: 'GET', url: 'api/projects/:projectId/environments', isArray: true },
        start  : { method: 'PUT', url: 'api/environments/:environmentId/start' },
        pause  : { method: 'PUT', url: 'api/environments/:environmentId/pause' }
      }
    );
  }]);