var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')

  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)

  , Task    = require('./task');




function TaskImplementation() {  
  Task.call(this);
  this.name = 'Find environment';  
}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;


TaskImplementation.prototype.execute = function execute(scope, log) {  
  
  // create local variables    
  var configuration_id = scope.configuration_id;

  // find the environment
  return Q.fcall(function() {          
    log('finding environment')    

    return skytap.environments.get({ configuration_id: configuration_id })
    .then(function(oldEnv) {
      log('environment %s found', oldEnv.id);
      scope.oldEnv = oldEnv;      
    })
  });

}
