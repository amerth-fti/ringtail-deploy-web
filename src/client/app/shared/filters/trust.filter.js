(function() {
  'use strict';
  
  angular
    .module('shared.filters')
    .filter('trust', trust);
  
  trust.$inject = [ '$sce' ];
  
  function trust($sce) {
    return function(html) {    
      return $sce.trustAsHtml(html);
    };
  }
  
}());