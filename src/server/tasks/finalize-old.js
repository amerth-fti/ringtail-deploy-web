var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl() {  
  Task.call(this);
  this.name = 'Finalize old environment';  

  this.execute = function execute(scope, log) {  
    
    return Q.fcall(function() {
      log('deleting old environment');

      var oldEnv = scope.oldEnv
        , opts;
                
      opts = {
        configuration_id: oldEnv.id,        
      };

      return skytap.environments.del(opts)    
    })

    .then(function() {
      log('environment deployed complete!');
    });

  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;