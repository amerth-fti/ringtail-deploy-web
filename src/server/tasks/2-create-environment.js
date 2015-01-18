var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl(options) {  
  this.name = 'Create environment';  
  Task.call(this, options);

  this.validators.required.push('template_id');

  this.execute = function execute(scope, log) {  
    var template_id = this.getData(scope, 'template_id')
      , deployment = scope.deployment;

    return Q.fcall(function() {
      log('creating new environment');    
      return skytap.environments.create({ template_id: template_id });        
    })

    .then(function(newEnv) {
      log('new environment %s created', newEnv.id);        
      return newEnv;
    })

    .then(function(newEnv) {
      log('setting deployment info for %s', newEnv.id);      
      return skytap.environments.updateUserdata({ 
        configuration_id: newEnv.id,
        contents: JSON.stringify(deployment, null, 2)
      })
      .then(function(user_data) {
        return newEnv;
      });
    })

    .then(function(newEnv) {
      log('deployment info has been set');
      return newEnv;
    });

  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;

