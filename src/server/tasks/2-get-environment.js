var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')

  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)

  , Task    = require('./task');




function TaskImplementation(options) {  
  Task.call(this, options);  
}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;


TaskImplementation.prototype.execute = function execute(scope, log) {  
  var self = this;

  // find the environment
  return Q.fcall(function() {          

    var configuration_id = eval(self.configuration_id)
      , result;

    log('finding environment %s', configuration_id);  
    return skytap.environments.get({ configuration_id: configuration_id })

    .then(function(env) {
      log('environment %s found', env.id);
      return env;
    });    

  });

}
