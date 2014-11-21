var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')

  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)

  , Task    = require('./task');


function TaskImplementation() {  
  Task.call(this);
  this.name = 'Suspend old environment';  
}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;


TaskImplementation.prototype.execute = function execute(scope, log) {  

  var configuration_id = scope.oldEnv.id;

  // stop the old environment
  return Q.fcall(function() {
    log('suspending environment %d', configuration_id);

    return skytap.environments.suspend({ configuration_id: configuration_id })
    .then(function() {
      log('waiting for suspended state');
      return skytap.environments.waitForState({ configuration_id: configuration_id, runstate: 'suspended' });
    })
    .then(function(oldEnv) {
      log('environment %d suspended', configuration_id)
      scope.oldEnv = oldEnv;
    });
  });
};
