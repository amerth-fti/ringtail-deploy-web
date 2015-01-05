(function() {
  'use strict';

  angular
    .module('app')
    .config(config);

  config.$inject = [ '$httpProvider' ];

  function config($httpProvider) {

    // add cache busting
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.common = {};
    }
    $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.common.Pragma = 'no-cache';
    $httpProvider.defaults.headers.common['If-Modified-Since'] = '0';
    $httpProvider.interceptors.push('loadingInterceptor');
  
  }

}());