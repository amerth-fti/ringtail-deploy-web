(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('RingtailConfig', RingtailConfig);

  RingtailConfig.$inject = [ '$http' ];
 
  function RingtailConfig($http) {    
    return {
      get: get
    };

    function get(role) {
      // this url path will need to be configurable to support 
      // use from the service as well as the deployer application
      return $http.get('/api/ringtail/config', { role: role });
    }    
  }

}());