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
        , user_data = scope.user_data
        , json = JSON.parse(user_data.contents);

      json.status = 'deleted';
      opts = {
        configuration_id: oldEnv.id,
        contents: JSON.stringify(json, null, 2)
      };

      return skytap.environments.updateUserdata(opts)    
    })

    .then(function() {
      log('environment deployed complete!');
    });

  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;