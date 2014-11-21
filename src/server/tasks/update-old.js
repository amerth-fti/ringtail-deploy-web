var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')

  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)

  , Task    = require('./task');


function TaskImplementation() {  
  Task.call(this);
  this.name = 'Update old environment';  
}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;


TaskImplementation.prototype.execute = function execute(scope, log) {  
  
  return Q.fcall(function() {      
    log('update status of old environment to redeploying');  

    var oldEnv = scope.oldEnv
      , json = JSON.parse(scope.user_data.contents)
      , opts;

    json.status = 'redeploying';

    opts = { 
      configuration_id: oldEnv.id,
      contents:  JSON.stringify(json, null, 2)
    };

    return skytap.environments.updateUserdata(opts);    
  });
};






























