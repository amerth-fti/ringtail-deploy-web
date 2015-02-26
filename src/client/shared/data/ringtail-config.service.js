(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('RingtailConfig', RingtailConfig);

  RingtailConfig.$inject = [ '$http' ];


  function RingtailConfig($http) {    
    return {
      combine: combine,
      dedup: dedup,
      get: get,          
      split: split
    };

    function get(role) {      
      // TODO this url path will need to be configurable to support 
      // use from the service as well as the deployer application
      return $http.get('/api/ringtail/configs', { params: { role: role }});
    }    

    function split(config) {
      var parts = config.split('|');
      return {
        application: parts[0],
        key: parts[1]
      };
    }

    function combine(config) {
      return config.application + '|' + config.key;
    }

    function dedup(configs) {
      var lookup = { }
        , results = [ ]
        , key
        ;

      // iterate each
      configs.forEach(function(config) {
        var configObj = split(config)
          , key = configObj.key
          , hit = lookup[key];
  
        // add to lookup
        if(!hit) {
          lookup[key] = configObj;
        } 
        // dupe hit, update to common
        else {
          lookup[key].application = 'Common';
        }
      });


      // generate configs
      for(key in lookup) {
        if(lookup.hasOwnProperty(key)) {
          results.push(combine(lookup[key]));
        }
      }
      return results;
    }    
  }

}());