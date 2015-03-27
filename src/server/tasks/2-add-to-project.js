var util    = require('util')  
  , Q       = require('q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl(options) {  
  this.name = 'Add to project';  
  Task.call(this, options);

  this.validators.required.push('project_id');
  this.validators.required.push('configuration_id');
  
  this.execute = function execute(scope, log) {      
    var project_id = this.getData(scope, 'project_id')
      , configuration_id = this.getData(scope, 'configuration_id');

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
  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;



