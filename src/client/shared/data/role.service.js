(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Role', Role);

  Role.$inject = [  ];
 
  function Role() {

    var roles = [
      'DEV-FULL',
      'AGENT',
      'RPF',
      'WEBAGENT',
      'WEBSERVER',      
      'DATABASE',
      'SKYTAP-ALLINONE',      
      'SKYTAP-DB',
      'SKYTAP-RPF',
      'SKYTAP-WEB',
      'SKYTAP-WEBAGENT'
    ];

    return {
      query: function(opts) {
        opts = opts || {
          remoteType: null
        };

        return roles.filter(function(role) {
          return  (opts.remoteType === 'skytap' && role.toLowerCase().indexOf('skytap') >= 0) ||
                  (opts.remoteType === null     && role.toLowerCase().indexOf('skytap') === -1);
        });
      }
    };
  }

}());