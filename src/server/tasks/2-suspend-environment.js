var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')

  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)

  , Task    = require('./task');


function TaskImplementation(options) {  
  this.name = 'Suspend environment';
  Task.call(this, options);  

  this.execute = function execute(scope, log) {  
    var configuration_id = this.getData(scope, 'configuration_id');

    return Q.fcall(function() {
      log('suspending environment %d', configuration_id);
      return skytap.environments.suspend({ configuration_id: configuration_id })
    })

    .then(function() {
      log('waiting for suspended state');
      return skytap.environments.waitForState({ configuration_id: configuration_id, runstate: 'suspended' });
    })

    .then(function(env) {
      log('environment %d suspended', configuration_id)
      return env;
    });
    
  };

}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;