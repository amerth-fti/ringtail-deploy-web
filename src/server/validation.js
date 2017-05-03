var debug       = require('debug')('deployer-validation')
  , envService  = require('./services/env-service');

function Validation(params) {
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

module.exports = Validation;


Validation.prototype.start = function start() {
  debug('starting validation');
  /* jshint es5:false */
  /* jshint newcap:false */
  let validation = this;
  let env = this.env;
  var me = this;

  // initialize the job data
  this.status = 'Pending';
  this.started = new Date();

  // start job on next tick
  process.nextTick(async function() {
    validation.status = 'Running';

    try
    {
      // create task chain
      for(let task of validation.tasks) {
        task.on('log', debug);
        task.validationId = validation.id;
        await task.start(validation.rundata);
      }

      let warn = me.discoverWarnings(validation.tasks);
      let status = warn ? 'Warning' : 'Succeeded';
      let envStatus = warn ? 'warning' : 'deployed';

      // mark as complete
      validation.status = status;
      validation.stopped = new Date();
      validation.messsage;
    }
    catch(err) {
      // mark as failed
      debug(err);
      validation.stopped = new Date();
      validation.status = 'Failed';
      validation.error = err + '';
    }
    finally {
      //await envService.logValidation(validation);
    }
  });
};

Validation.prototype.discoverWarnings = function discoverWarnings(tasks) {
  let warn = false;

  if(tasks) {
    for(let task of tasks) {
      if(task.status === 'Warning') {
        warn = true;
      }
      if(task.tasks) {
        for(let subTask of task.tasks) {
          if(subTask.status === 'Warning') {
            warn = true;
          }
        }
      }
    }
  }

  return warn;
};
