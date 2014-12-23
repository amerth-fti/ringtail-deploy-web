(function() {
  'use strict';

  angular
    .module('shared.filters')
    .filter('reverse', reverse);

  function reverse() {
    return function(items) {
      if(!items) return null;
      return items.slice().reverse();  
    };
  }

}());