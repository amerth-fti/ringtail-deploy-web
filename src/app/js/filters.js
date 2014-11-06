
var filters = angular.module('filters', []);


filters.filter('trust', ['$sce', function ($sce) {
  return function(html) {    
    return $sce.trustAsHtml(html);
  }
}]);


filters.filter('newlines', [ function () {
  return function(text) {
    if(!text) return null;
    
    return text.replace(/\n/g, '\n<br/>');
  }
}]);


filters.filter('anchors', [ function () {
  return function(text) {
    if(!text) return null;

    var regex = /https?:\/\/[\S\/\.#-]+/g;
    return text.replace(regex, function(url) {
      return '<a href="' + url + '">' + url + '</a>';
    });
  }
}]);