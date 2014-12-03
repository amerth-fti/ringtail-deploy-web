'use strict';

var app = angular.module('app', [
  'ngRoute',  
  'ngAnimate',
  'ui.bootstrap',
  'controllers',
  'services',
  'filters'
  ]);

app.constant('config', window.appConfig);
app.constant('globals', { loading: 0 });

app.config(['$routeProvider', '$httpProvider', 'config',
  function($routeProvider, $httpProvider, config) {

    $routeProvider
    .when('/projects', {
      templateUrl: 'app/partials/project-list.html',
      controller: 'ProjectListCtrl'
    })
    .when('/projects/:projectId', {
      templateUrl: 'app/partials/project-details.html',
      controller: 'ProjectDetailsCtrl'
    })
    .when('/jobs/:jobId', {
      templateUrl: 'app/partials/job-details.html',
      controller: 'JobDetailsCtrl'
    })
    .otherwise({
      redirectTo: config.defaultRoute || '/projects/'
    });


    // add cache busting
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.common = {};
    }
    
    $httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";
    $httpProvider.defaults.headers.common.Pragma = "no-cache";
    $httpProvider.defaults.headers.common["If-Modified-Since"] = "0";
  
    $httpProvider.interceptors.push('loadingInterceptor')
  }]);



app.factory('loadingInterceptor', function($q, globals) {
  return {
    // request success
    'request': function(config) {
      globals.loading += 1;
      console.log(globals.loading);
      return config;
    },
    // requet failure
    'requestError': function(rejection) {
      globals.loading -= 1;
      console.log(globals.loading);
      return rejection;
    },
    // response success
    'response': function(response) {
      globals.loading -= 1;
      console.log(globals.loading);
      return response;
    },
    'responseError': function(rejection) {
      globals.loading -= 1;
      console.log(globals.loading);
      return rejection
    }
  }
})
