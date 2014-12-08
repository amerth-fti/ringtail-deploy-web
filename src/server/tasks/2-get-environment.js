var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')

  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)

  , Task    = require('./task');




function TaskImplementation(options) {  
  this.name = 'Get environment';
  Task.call(this, options);  

  this.execute = function execute(scope, log) {      
    var configuration_id = this.getData(scope, 'configuration_id');

    return Q.fcall(function() {
      log('finding environment %s', configuration_id);  
      return skytap.environments.get({ configuration_id: configuration_id });
    })

    .then(function(env) {
      log('environment %s found', env.id);
      return env;
    });

  };
}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;
