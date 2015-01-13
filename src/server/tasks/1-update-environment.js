var util        = require('util')  
  , Q           = require('Q')
  , _           = require('underscore')
  , config      = require('../../../config')
  , envSvc      = require('../services/envService')
  , machineSvc  = require('../services/machineService')
  , importSvc   = require('../services/importService')
  , Task        = require('./task')
  ;


function TaskImpl(options) {  
  this.name = 'Update environment';  
  Task.call(this, options);

  this.execute = function execute(scope, log) {  
    var skytapEnv = this.getData(scope, 'skytapEnv')
      , env = this.getData(scope, 'env')
      , key;
    
    // update env level items    
    return Q.fcall(function() {
      log('updating environment remoteId to %s', skytapEnv.id);
      env.remoteId = skytapEnv.id;
      return envSvc.update(scope.me);
    })

    // update machine references
    .then(function() {
      var deletePromises
        , addPromises
        ;

      deletePromises = env.machines.map(function(machine) {
        return machineSvc.del(machine.machineId);
      });

      addPromises = skytapEnv.vms.map(function(vm) {
        return importSvc.skytapVM(env.envId, vm);
      });

      return Q
        .fcall(function() {
          return Q.all(deletePromises);
        })
        .then(function(){
          return Q.all(addPromises);
        })
        .then(function(machines) {
          log('added machines %j', machines);
          env.machines = machines;
          return env;
        });
    });

  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;