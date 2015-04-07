var debug       = require('debug')('deployer-redeployservice')
  , Q           = require('q')
  , _           = require('underscore')
  , envService  = require('../services/env-service')
  , Env         = require('../models/env')
  , taskfactory = require('../taskfactory')
  , jobrunner   = require('../jobrunner')
  , Job         = require('../job')
  ;

exports.redeploy = function redeploy(data, opts, next) {
  debug('starting deploy');

  var env           = new Env(data)
    , selectedTasks = data.selectedTasks
    , job
    , jobId
    ;

  return Q
    .fcall(function() {            
      // create redeploy task
      job = new Job({
        name: 'Redeploy environment ' + env.envName,
        tasks: taskfactory.createTasks(selectedTasks),
        rundata: { me: env, options: opts },
        env: env
      });

      // enqueue task  
      jobId = jobrunner.add(job);
      env.deployedJobId = jobId;
    })      
    .then(function() {
      // start the job
      job.start();
    })  
    .then(function() {
      // return the completed env
      return env;
    })
    .nodeify(next);
};