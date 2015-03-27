(function() {
  'use strict';
  
  angular
    .module('shared.filters')
    .filter('nbsp', nbsp);
  
  nbsp.$inject = [ ];
  
  function nbsp() {
    return function(html) {    
      var result = '';
      if(html) {
        result = html.replace(/  /g, '&nbsp;&nbsp;');
      }
      return result;
    };
  }
  
}());