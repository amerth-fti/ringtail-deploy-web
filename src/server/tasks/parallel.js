var util        = require('util')  
  , Q           = require('q')  
  , taskfactory = require('../taskfactory')
  , Task        = require('./task');


function TaskImpl(options) {  
  this.name = 'Parallel';  
  Task.call(this, options);

  this.execute = function execute(scope, log) {  
    var promises
      , self = this;

    this.tasks = taskfactory.createTasks(this.taskdefs);    
            
    promises = this.tasks.map(function(task) { 
      log('starting subtask %s', task.name);

      task.on('log', function(data) {
        self.emit('log', data);
      });

      return task.start(scope);
    });
    
    log('all subtasks started');
    
    return Q
    .all(promises)
    .then(function(vals) {      
      log('all subtasks complete');
    });
  };
}

util.inherits(TaskImpl, Task);
module.exports = TaskImpl;