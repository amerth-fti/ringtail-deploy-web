var debug             = require('debug')('deployer-redeployservice')
  , Q                 = require('q')
  , _                 = require('underscore')
  , envService        = require('../services/env-service')
  , launchkeyService  = require('../services/launchkey-service')
  , Env               = require('../models/env')
  , taskfactory       = require('../taskfactory')
  , jobrunner         = require('../jobrunner')
  , Job               = require('../job')
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

exports.quickRedeploy = async function redeploy(data, next) {
  debug('starting quick deploy');

  let me = this;
  let environment = await envService.findById(data.envId);
  let env = new Env(environment);
  let selectedTasks = env.config.taskdefs.slice(0);

  env.deployedBranch = data.branch;
  let validKeys = [];

  try {
    let allKeys = await launchkeyService.requestLaunchKeysAwait({envId: data.envId, branch: data.branch});
    debug('quickdeploy got env: %j', env);

    if(env.updatePath !== null) {
      validKeys = _.filter(JSON.parse(allKeys), function(key) {
        var okay = false;
        if(env.updatePath === '0') { 
          okay = true;
        }
        if(env.updatePath === '1') {
          okay = key.KeyType === 'ALPHA' || key.KeyType === 'BETA' ||  key.KeyType === 'GAMMA' ||  key.KeyType === 'RC';
        }
        if(env.updatePath === '2') {
          okay = key.KeyType === 'BETA' ||  key.KeyType === 'GAMMA' ||  key.KeyType === 'RC';
        }
        if(env.updatePath === '3') {
          okay = key.KeyType === 'GAMMA' ||  key.KeyType === 'RC';
        } 
        if(env.updatePath === '4') {
          okay = key.KeyType === 'RC';
        } 
        return okay;
      });
    }
  } catch(err) {
    debug('got error getting launch keys ', err);
  }

  try {
    let sendKeys = await launchkeyService.sendLaunchKeys({envId: env.envId, launchKeys: validKeys});
  } catch(err) {
    debug('got error sending launch key', err);
  }

  try {
    await envService.update(env);

    // create redeploy task
    let job = new Job({
      name: 'Redeploy environment ' + env.envName,
      tasks: taskfactory.createTasks(selectedTasks),
      rundata: { me: env, options: {}},
      env: env
    });


    let localJobId = await jobrunner.add(job);
    await job.start();
    return { jobId: localJobId };
  } 
  catch(err) {
    debug('got error ', err);
    throw err;
  }
};


