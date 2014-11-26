

function createTask(taskdef) {
  var path = './tasks/'
    , name
    , options;

  if(typeof taskdef === 'string') {     
    name = taskdef;
  }
  else if(taskdef.name) {
    name = taskdef.name;
  }
  else if (taskdef.task) {
    name = taskdef.task;
    options = taskdef.options;
  }

  var Task = require(path + name);  
  return new Task(options);
}


function createTasks(taskdefs) {
  return taskdefs.map(createTask);
}

module.exports = {
  createTask: createTask,
  createTasks: createTasks
};