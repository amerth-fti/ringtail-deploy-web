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
        rundata: { me: env },
        env: env
      });

      // enqueue task  
      jobId = jobrunner.add(job);
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