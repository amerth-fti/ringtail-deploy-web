(function() {
  'use strict';

  angular
    .module('app')
    .config(config);

  config.$inject = [ '$httpProvider', '$locationProvider' ];

  function config($httpProvider, $locationProvider) {

    // add cache busting
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.common = {};
    }
    $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.common.Pragma = 'no-cache';
    $httpProvider.defaults.headers.common['If-Modified-Since'] = '0';

    // I don't think this is being used and it breaks promises...
    // $httpProvider.interceptors.push('loadingInterceptor');

    // use pushstate
    $locationProvider.html5Mode(true);
  }

}());