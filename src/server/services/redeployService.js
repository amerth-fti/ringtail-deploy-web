var debug       = require('debug')('deployer-redeployservice')
  , Q           = require('Q')
  , _           = require('underscore')
  , envService  = require('../services/envService')
  , Env         = require('../models/env')
  , taskfactory = require('../taskfactory')
  , jobrunner   = require('../jobrunner')
  , Job         = require('../job')
  ;

exports.redeploy = function redeploy(data, next) {
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
        rundata: { env: env }
      });

      // enqueue task  
      jobId = jobrunner.add(job);
    })  
    .then(function() { 
      // update the environment
      env.status = 'deploying';
      env.deployedJobId = jobId;
      return env
        .validate()        
        .then(function() {
          return envService.update(env);
        })
        .then(function(savedEnv) {
          env = savedEnv;
        });
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