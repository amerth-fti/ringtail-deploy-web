var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl() {  
  Task.call(this);
  this.name = 'Finalize new environment';

  this.execute = function execute(scope, log) {  
    
    return Q.fcall(function() {
      log('updating status of new environment');

      var newEnv = scope.newEnv
        , user_data = scope.user_data
        , json = JSON.parse(user_data.contents)
        , opts;

      json.status = 'deployed';
      json.date = new Date();
      opts = {
        configuration_id: newEnv.id, 
        contents: JSON.stringify(json, null, 2) 
      };

      return skytap.environments.updateUserdata(opts)
      .then(function(user_data){
        scope.user_data = user_data;      
      });
    });

  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;  
