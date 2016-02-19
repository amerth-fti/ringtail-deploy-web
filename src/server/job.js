var debug       = require('debug')('deployer')
  , Q           = require('q')
  , envService  = require('./services/env-service');

function Job(params) {
  this.id = 0;
  this.status = 'Pending';
  this.started = null;
  this.stopped = null;
  this.name = null;
  this.tasks = [];
  this.rundata =  { };
  this.env = null;

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
    , job = this
    , env = this.env;

  // initialize the job data
  this.status = 'Pending';
  this.started = new Date();

  // start job on next tick
  process.nextTick(function() {
    job.status = 'Running';

    // mark environment as starting
    chain.then(function() {
      env.status = 'deploying';
      env.deployedJobId = job.id;
      return envService.update(env);
    });

    // create task chain
    job.tasks.forEach(function(task) {
      task.on('log', debug);
      task.jobId = job.id;

      chain = chain.then(function () {
        return task.start(job.rundata);
      });
    });

    // mark as complete
    chain.then(function() {
      job.status = 'Succeeded';
      job.stopped = new Date();
    });

    // mark environment as deployed
    chain.then(function() {
      env.deployedOn = new Date().toUTCString();
      env.status = 'deployed';
      return envService.update(env);
    })

    // mark as failed
    .fail(function(err) {
      debug(err);
      job.stopped = new Date();
      job.status = 'Failed';
      job.error = err;
      env.status = 'failed';
      return envService.update(env);
    });

  });
};