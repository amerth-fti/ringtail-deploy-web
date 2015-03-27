var util        = require('util')  
  , Q           = require('q')
  , _           = require('underscore')
  , config      = require('../../../config')
  , envSvc      = require('../services/env-service')
  , machineSvc  = require('../services/machine-service')
  , importSvc   = require('../services/import-service')
  , Task        = require('./task')
  ;


function TaskImpl(options) {  
  this.name = 'Update environment';  
  Task.call(this, options);

  this.validators.required.push('skytapEnv');
  this.validators.required.push('env');

  this.execute = function execute(scope, log) {  
    var skytapEnv = this.getData(scope, 'skytapEnv')
      , env       = this.getData(scope, 'env')
      , key;
    
    // update env level items    
    return Q.fcall(function() {
      log('updating environment remoteId to %s', skytapEnv.id);
      env.remoteId = skytapEnv.id;
      return envSvc.update(scope.me);
    })

    // update machine references
    .then(function() {
      var promises;

      if(env.machines.length !== skytapEnv.vms.length) {
        throw new Error('Skytap machines do not map correctly to environment machines');
      }

      promises = env.machines.map(function(machine, idx) {
        var vm = skytapEnv.vms[idx];
        machine.remoteId = vm.id;
        machine.intIP = vm.interfaces[0].nat_addresses.vpn_nat_addresses[0].ip_address;
        machine.installNotes = null;
        return machineSvc.update(machine);
      });

      return Q
        .all(promises)
        .then(function(machines) {
          log('updated machines %j', machines);
          env.machines = machines;
          return env;
        });
    });

  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;