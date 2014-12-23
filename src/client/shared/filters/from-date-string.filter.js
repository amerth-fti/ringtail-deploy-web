(function() {
  'use strict';

  angular
    .module('shared.filters')
    .filter('fromDateString', fromDateString);

  function fromDateString() {
    return function(dateStr) {
      if(!dateStr) return '';
      else {
        return new Date(dateStr);
      }
    };
  }

}());