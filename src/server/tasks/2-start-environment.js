var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl(options) {  
  this.name = 'Add to project';  
  Task.call(this, options);
    
  this.execute = function execute(scope, log) {  
    var configuration_id = this.getData(scope, 'configuration_id');

    return Q.fcall(function() {
      log('start environment %s', configuration_id);
      return skytap.environments.update({
        configuration_id: configuration_id,
        runstate: 'running'
      });
    })

    .then(function(environment) {
      log('waiting for running state');
      return skytap.environments.waitForState({
        configuration_id: environment.id,
        runstate: 'running'
      });
    })

    .then(function(environment) {
      log('new environment has been started')
      return environment;
    });

  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;



