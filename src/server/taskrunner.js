
var debug   = require('debug')('deployer-taskrunner')
  , _       = require('underscore')
  , Q       = require('Q')
  , tasks   = {}
  , taskId  = 0;


/** 
 * Gets all tasks by returning an array of tasks
 * 
 * @return {Array} array of tasks
 */
exports.getTasks = function getTasks() {  
  return _.values(tasks); 
}


/** 
 * Gets a task by the task identifier
 * 
 * @return {Task} task instance
 */
exports.getTask = function getTask(taskId) {
  return tasks[taskId];
}


/** 
 * Enqueue a task for processing by setting the status
 * and creating a task id. The task will run in the background
 * as a promise and will mark the task as complete or errored
 * depending on the outcome.
 *  
 * @return {Number} returns the taskId that was generated
 */
exports.queue = function queue(task) {
  
  // initialize the task data
  task.status = 'Pending';
  task.id = (taskId += 1);
  task.started = new Date();
  task.stopped = null;  

  // add to memory store
  tasks[task.id.toString()] = task;

  // start task on next tick
  process.nextTick(function() {
    task.status = 'Running'
    
    // start the task
    task.promise = task.start()    

    // mark as complete
    .then(function() {
      debug('task %d completed', task.id);
      task.status = 'Completed';
      task.stopped = new Date();
    })

    // mark as failed
    .fail(function(err) {
      debug('task %d error %j', task.id, err);
      task.status = 'Error';
      task.error = err;   
      task.stopped = new Date();   
    });
    
  });

  return task.id;
}