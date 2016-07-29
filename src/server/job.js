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
  let job = this;
  let env = this.env;

  // initialize the job data
  this.status = 'Pending';
  this.started = new Date();

  // start job on next tick
  process.nextTick(async function() {
    job.status = 'Running';

    try
    {
      // mark environment as starting
      env.status = 'deploying';
      env.deployedJobId = job.id;
      await envService.update(env);

      // create task chain
      for(let task of job.tasks) {
        task.on('log', debug);
        task.jobId = job.id;
        await task.start(job.rundata);
      }

      // mark as complete
      job.status = 'Succeeded';
      job.stopped = new Date();

      // mark environment as deployed
      env.deployedOn = new Date().toUTCString();
      env.status = 'deployed';
      await envService.update(env);

    }
    catch(err) {
      // mark as failed
      debug(err);
      job.stopped = new Date();
      job.status = 'Failed';
      job.error = err;
      env.status = 'failed';
      await envService.update(env);
    }
    finally {
      await envService.log(job);
    }

  });
};