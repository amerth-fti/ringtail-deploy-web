(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('DeployerSession', DeployerSession);

  DeployerSession.$inject = [ '$resource' ];
 
  function DeployerSession($resource) {
    var user = null;

    return $resource(
      'api/session', {}, {
          query: { method: 'GET', 
            isArray: false,
            transformResponse: function(data) {
              var tempJSON;
              try {
                tempJSON = JSON.parse(data);
                if(tempJSON && tempJSON.user) {
                  user = tempJSON.user
                }
              } catch(err) {
                tempJSON = null;
                console.error(err);
              }
              
              return tempJSON;
            } 
          },
          getUser: function() {
            return user || null;
          }
      }
    );
  }

}());