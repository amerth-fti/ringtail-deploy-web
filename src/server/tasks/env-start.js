var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl() {  
  Task.call(this);
  this.name = 'Start new environment';  

  this.execute = function execute(scope, log) {  
    
    return Q.fcall(function() {
      log('start new envionrment');

      return skytap.environments.update({
        configuration_id: scope.newEnv.id,
        runstate: 'running'
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
        scope.newEnv = environment;
      });
    });
  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;
  