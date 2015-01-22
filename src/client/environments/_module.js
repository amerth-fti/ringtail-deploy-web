(function() {
  'use strict';

  angular
    .module('app.environments', [ 
      'ngResource',
      'app.environments.editor',
      'app.environments.machine'
    ]);

}());