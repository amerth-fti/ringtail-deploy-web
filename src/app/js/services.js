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
        update  : { method: 'PUT', url: 'api/environments/:environmentId' },              
        project : { method: 'GET', url: 'api/projects/:projectId/environments', isArray: true },
        start   : { method: 'PUT', url: 'api/environments/:environmentId/start' },
        pause   : { method: 'PUT', url: 'api/environments/:environmentId/pause' },
        redeploy: { method: 'PUT', url: 'api/environments/:environmentId/redeploy' }
      }
    );
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
    this.who = '',
    this.until = new Date(),
    this.notes = ''
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