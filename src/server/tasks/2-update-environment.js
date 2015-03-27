var util    = require('util')  
  , Q       = require('q')
  , _       = require('underscore')

  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)

  , Task    = require('./task');


function TaskImplementation(options) {  
  this.name = 'Update environment data';
  Task.call(this, options);   

  this.validators.required.push('configuration_id'); 

  this.execute = function execute(scope, log) {  
    var configuration_id = this.getData(scope, 'configuration_id')      
      , update = this.getData(scope, 'update', true)
      , args;

      args = {
        configuration_id: configuration_id,        
      };
      _.extend(args, update);


    return Q.fcall(function() {
      log('updating environment %s with values :%j', configuration_id, update);      
      return skytap.environments.update(args);
    })

    .then(function(env) {
      log('environment succesfully updated');
      return env;
    });

  };
}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;