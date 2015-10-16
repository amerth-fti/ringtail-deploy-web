(function() {
  'use strict';

  angular
    .module('app.environments', [ 
      'ngResource',
      'app.environments.config',
      'app.environments.editor',
      'app.environments.machine',
      'app.environments.starter',
      'app.environments.redeploy',
      'app.environments.taskdefs'
    ]);

}());