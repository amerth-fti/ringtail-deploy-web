var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')

  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)

  , Task    = require('./task');


function TaskImplementation() {  
  Task.call(this);
  this.name = 'Newest template';  
}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;


TaskImplementation.prototype.execute = function execute(scope, log) {  

  var project_id = scope.project_id;

  // find the newest template
  return Q.fcall(function() {
    log('finding newest template');

    return skytap.projects.templates({ project_id: project_id })  
    .then(function(templates) {      
      scope.template = _.max(templates, function(template) {
        return template.id;
      });  
      log('found newest template %s', scope.template.id);
    })
  });
};