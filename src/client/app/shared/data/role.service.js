(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('Role', Role);

  Role.$inject = [  ];

  function Role() {
    var _roles = [
      'DEV-FULL',
      'AGENT',
      'WEBAGENT',
      'WEB',
      'RPF-COORDINATOR',
      'RPF-SUPERVISOR',
      'DATABASE',
      'SKYTAP-ALLINONE',
      'SKYTAP-AGENT',
      'SKYTAP-DB',
      'SKYTAP-RPF-COORDINATOR',
      'SKYTAP-RPF-SUPERVISOR',
      'SKYTAP-WEB'
    ];

    return {
      /**
       * Finds the distinct roles in an array of roles
       * @param {Array} roles
       * @returns {Array}
       */
      distinct: distinct,
      /**
       * Finds the distinct roles in an environment
       * @param {Environment} environment
       * @returns {Array} distinct roles
       */
      environment: environment,
      /**
       * Gets or sets the roles for the service
       * @config {Array} [roles]
       * @returns {Array}
       */
      roles: roles
    };

    function distinct(roles) {
      var keys = {}
        , results = [];

      roles.forEach(function(role) {
        if(role && !keys[role]) {
          keys[role] = role;
          results.push(role);
        }
      });
      return results;
    }

    function environment(env) {
      var machines = env.machines
        , roles = [];

      if(machines) {
        roles = machines.map(function(machine) {
          return machine.role;
        });
        roles = distinct(roles);
      }
      return roles;
    }

    function roles(roles) {
      if(roles) {
        _roles = roles;
      }
      return _roles;
    }
  }

}());