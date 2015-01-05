var debug = require('debug')('deployer')
  , Q = require('q');

function Job(params) {  
  this.id = 0;
  this.status = 'Pending';
  this.started = null;
  this.stopped = null;
  this.name = null;
  this.tasks = [];
  this.rundata =  { };  

  for(var key in params) {
    if(params.hasOwnProperty(key)) {
      this[key] = params[key];
    }
  }
}

module.exports = Job;


Job.prototype.start = function start() {

  /* jshint es5:false */
  /* jshint newcap:false */
  var chain = Q(0)
    , job = this;

  // initialize the job data
  this.status = 'Pending';  
  this.started = new Date();

  // start job on next tick
  process.nextTick(function() {
    job.status = 'Running';
    
    // create task chain    
    job.tasks.forEach(function(task) {    
      task.on('log', debug);      

      chain = chain.then(function () {        
        return task.start(job.rundata);
      });    
    });

    // mark as complete
    chain.then(function() {      
      job.status = 'Succeeded';
      job.stopped = new Date();
    })

    // mark as failed
    .fail(function(err) {
      debug(err);
      job.stopped = new Date();
      job.status = 'Failed';
      job.error = err;         
    });
    
  });
};