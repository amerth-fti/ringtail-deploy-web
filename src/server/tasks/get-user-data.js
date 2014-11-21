var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')

  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)

  , Task    = require('./task');




function TaskImplementation() {  
  Task.call(this);
  this.name = 'Get user_data';  
}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;


TaskImplementation.prototype.execute = function execute(scope, log) {  
  
  // create local variables    
  var configuration_id = scope.configuration_id;

  // find the environment
  return Q.fcall(function() {     
    log('finding the user_data'); 

    return skytap.environments.userdata({ configuration_id: configuration_id })
    .then(function(user_data) { 
      log('user_data has been found');  

      // validate user_data is found
      if(!user_data) {
        throw new Error('Environment must have user_data configured');
      }          
      
      scope.user_data = user_data;
    })
  })

}
