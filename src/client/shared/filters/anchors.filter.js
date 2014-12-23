(function() {
  'use strict';
  
  angular
    .module('shared.filters')
    .filter('anchors', anchors);
  
  function anchors() {
    return function(text) {
      if(!text) return null;

      var regex = /https?:\/\/[\S\/\.#-]+/g;
      return text.replace(regex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
      });
    };
  }
  
}());