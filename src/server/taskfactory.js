

function createTask(taskdef) {
  var path = './tasks/'
    , name;

  if(typeof taskdef === 'string') {     
    name = taskdef;
  }
  else if(taskdef.name) {
    name = taskdef.name;
  }

  var Task = require(path + name);  
  return new Task();
}


function createTasks(taskdefs) {
  return taskdefs.map(createTask);
}

module.exports = {
  createTask: createTask,
  createTasks: createTasks
};