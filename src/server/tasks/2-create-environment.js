var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl(options) {  
  this.name = 'Create new environment';  
  Task.call(this, options);

  this.execute = function execute(scope, log) {  
    var self = this;

    return Q.fcall(function() {      

      var template_id = eval(self.template_id);

      log('creating new environment');    
      return skytap.environments.create({ template_id: template_id })    
      .then(function(newEnv) {
        log('new environment created %s', newEnv.id);
        scope.newEnv = newEnv;
      })

      .then(function() {
        log('updating new environment details');
        var configuration_id = scope.newEnv.id
          , name = scope.oldEnv.name
          , description = scope.oldEnv.description;

        return skytap.environments.update({
          configuration_id: configuration_id,
          name: name, 
          description: description
        });
      })
      .then(function() {
        log('setting new environment user_data');

        var newEnv = scope.newEnv
          , user_data = scope.user_data
          , json = JSON.parse(user_data.contents)
          , opts;

        json.status = 'deploying';

        var opts = {
          configuration_id: newEnv.id,
          contents: JSON.stringify(json, null, 2)
        };
        
        return skytap.environments.updateUserdata(opts)
        .then(function(user_data) {
          log('new environment user_data configured')
          scope.user_data = user_data;        
        });

      });
    });
  }
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;

