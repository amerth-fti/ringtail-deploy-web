(function () {
  'use strict';

  angular
    .module('shared')
    .factory('loadingInterceptor', loadingInterceptor);

  loadingInterceptor.$inject = ['$q', 'globals'];

  function loadingInterceptor($q, globals) {
    return {
      // request success
      'request': function(config) {
        globals.loading += 1;      
        return config;
      },
      // requet failure
      'requestError': function(rejection) {
        globals.loading -= 1;      
        return rejection;
      },
      // response success
      'response': function(response) {
        globals.loading -= 1;      
        return response;
      },
      'responseError': function(rejection) {
        globals.loading -= 1;      
        return rejection;
      }
    };
  }

}());