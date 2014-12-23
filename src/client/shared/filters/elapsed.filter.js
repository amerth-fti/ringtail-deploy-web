(function() {
  'use strict';

  angular
    .module('shared.filters')
    .filter('elapsed', elapsed);

  function elapsed() {
    return function(elapsed) {
      if(!elapsed) return '0m';
      else {
        elapsed = elapsed / 1000 / 60;
        return Math.floor(elapsed) + 'm';
      }
    };
  }

}());