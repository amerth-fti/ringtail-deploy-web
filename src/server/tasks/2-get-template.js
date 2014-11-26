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

  var template_id = this.template_id;  
  if(template_id === "newest") {
    var project_id = this.project_id;
    return getNewestTemplate(project_id, scope, log);
  }

};


function getNewestTemplate(project_id, scope, log) {  

  return Q.fcall(function() {
    log('finding newest template');

    return skytap.projects.templates({ project_id: project_id })  
    .then(function(templates) {      
      var result = _.max(templates, function(template) {
        return template.id;
      });  

      log('found newest template %s', result.id);
      return result;
    })
  });
}