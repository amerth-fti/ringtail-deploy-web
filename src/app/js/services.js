'use strict';

var deployerServices = angular.module('deployerServices', ['ngResource']);

deployerServices.factory('Project', ['$resource', 
  function($resource) {
    return $resource('api/projects/:projectId', {}, {
      query: { method: 'GET', isArray: true }
    });
  }]);

deployerServices.factory('ProjectEnvironment', ['$resource', 
  function($resource) {
    return $resource('api/projects/:projectId/environments', {}, {
      query: { method: 'GET', isArray: true },
      get  : { method: 'GET', url: 'api/environments/:environmentId', params: { environmentId: '@id' } },
      start: { method: 'PUT', url: 'api/environments/:environmentId/start', params: { environmentId: '@id' } },
      pause: { method: 'PUT', url: 'api/environments/:environmentId/pause', params: { environmentId: '@id' } }
    });
  }]);