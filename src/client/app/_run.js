(function() {
  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = [ '$rootScope', '$routeParams', 'globals' ];

  function run($rootScope, $routeParams, globals) {
    $rootScope.routeParams = $routeParams;
    $rootScope.globals = globals;    
  }

}());