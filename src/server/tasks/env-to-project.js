var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl() {  
  Task.call(this);
  this.name = 'Add to project';  

  this.execute = function execute(scope, log) {  
    
    var project_id = scope.project_id
      , configuration_id = scope.newEnv.id;

    return Q.fcall(function() {      
      log('adding environment %s to project %s', configuration_id, project_id);
      return skytap.projects.addEnvironment({ 
        project_id: project_id,
        configuration_id: configuration_id
      })
      .then(function() {
        log('added environment to project');
      });
    });  
  }
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;



