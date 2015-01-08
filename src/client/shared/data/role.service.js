(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Role', Role);

  Role.$inject = [  ];
 
  function Role() {

    var roles = [
      'DEV-FULL',
      'WEBSERVER',
      'AGENT',
      'WEBAGENT',
      'RPF',
      'DATABASE',
      'SKYTAP-ALLINONE',
      'SKYTAP-WEB',
      'SKYTAP-WEBAGENT',
      'SKYTAP-DB'
    ];

    return {
      query: function() {
        return roles;
      }
    };
  }

}());