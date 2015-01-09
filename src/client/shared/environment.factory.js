(function() {
  'use strict';

  angular
    .module('shared')
    .factory('environmentFactory', environmentFactory);

  environmentFactory.$inject = [ 'Environment' ];
 
  function environmentFactory(Environment) {
    return {
      fromSkytap: fromSkytapEnvironment
    };

    function fromSkytapEnvironment(skytapEnv) {
      var env = new Environment();
      env.envName = skytapEnv.name;
      env.envDesc = skytapEnv.description;
      env.remoteType = 'skytap';
      env.remoteId = skytapEnv.id;
      env.machines = skytapEnv.vms.map(fromSkytapMachine);
      return env;
    }

    function fromSkytapMachine(skytapVm) {
      var machine = { };
      machine.machineName = skytapVm.name;
      machine.remoteId = skytapVm.id;

      if( skytapVm.interfaces[0] && 
          skytapVm.interfaces[0].nat_addresses && 
          skytapVm.interfaces[0].nat_addresses.vpn_nat_addresses[0]) {
        machine.intIP = skytapVm.interfaces[0].nat_addresses.vpn_nat_addresses[0].ip_address;
      }
      return machine;
    }

  }

}());