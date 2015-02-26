(function() {
  
  angular
    .module('underscore', [])
    .factory('_', underscore);

  function underscore() {
    // assumes underscore is alerady loaded on page
    return window._;
  }
  
}());