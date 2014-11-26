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

  return Q.fcall(function() {

    var configuration_id = eval(self.configuration_id);    

    return Q.fcall(function() {
      log('getting user_data');
      return skytap.environments.userdata({ configuration_id: configuration_id })
    })

    .then(function(user_data) {
      log('found user_data');
      return user_data;
    })

    .then(function(user_data) {
      log('parsing user_data');
      return JSON.parse(user_data.contents);
    })

    .then(function(json) {
      log('updating user_data');

      for(var key in self.contents) {
        json[key] = self.contents[key];
      }

      return skytap.environments.updateUserdata({ 
        configuration_id: configuration_id,
        contents:  JSON.stringify(json, null, 2)
      });
    })

    .then(function(user_data) {
      log('user_data successfully updated');
      return user_data;
    });

  });
};






























