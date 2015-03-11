(function() {
  'use strict';
  
  angular
    .module('shared.filters')
    .filter('newlines', newlines);
  
  function newlines() {
    return function(text) {
      if(!text) return null;
      return text.replace(/\n/g, '\n<br/>');
    };
  }

}());