var debug             = require('debug')('deployer-redeployservice')
  , Q                 = require('q')
  , _                 = require('underscore')
  , globalConfig      = require('../../../config')
  , envService        = require('../services/env-service')
  , browserFactory    = require('../services/browser-factory')
  , regionService     = require('../services/region-service')
  , launchkeyService  = require('../services/launchkey-service')
  , Env               = require('../models/env')
  , taskfactory       = require('../taskfactory')
  , jobrunner         = require('../jobrunner')
  , Job               = require('../job')
  , Validation        = require('../validation')  
  , validationRunner  = require('../validationrunner')    
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
    let regionId = await envService.findRegionByEnvId(env.envId);
    let region = await regionService.findById(regionId);
    let browser = browserFactory.fromRegion(region, '0.0.0.0');
    debug('browser %j', browser);
    let files = [];
    if(browser !== null) {

      // validate the files on protocols that support file checking.   otherwise, Chuck and Pray.
      if(browser.type === 'ftp' || browser.type === 'smb') {  
        let getFiles = await browser.files(data.branch);
        getFiles = JSON.parse(getFiles);
      
        if(getFiles[0] === 'OK') {
          debug('got files okay');
        } else {
          throw getFiles;
        }
      }

      // getFiles = await browser.branches();
      // debug('branches %j', getFiles);

      //getFiles = await browser.builds('Main');
      //debug('buidls %j', getFiles);
    }
  } catch(err) {
    debug('got an error checking on file location %s', err);
    throw err;
  }

  try {
    let allKeys = await launchkeyService.requestLaunchKeysAwait({envId: data.envId, branch: data.branch});

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
    debug('got error getting launch keys %s', err);
    throw err;
  }

  try {
    let sendKeys = await launchkeyService.sendLaunchKeys({envId: env.envId, launchKeys: validKeys});
  } catch(err) {
    debug('got error sending launch key %s', err);
    throw err;
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


    let jobId = await jobrunner.add(job);
    let url = globalConfig.host === null ? 'localhost:' + globalConfig.port : globalConfig.host + ':' + globalConfig.port;
    let jobUrl = 'http://' + url + '/app/jobs/' + jobId;
    await job.start();
    return { jobId: jobId, jobUrl: jobUrl  };
  } 
  catch(err) {
    debug('got error %s', err);
    throw err;
  }
};

exports.validateDeploy = async function redeploy(data, next) {
  debug('starting deployment validation');

  let me = this;
  let environment = await envService.findById(data.envId);
  let env = new Env(environment);
  let selectedTasks = [{
    "task": "3-validate-many",
    "options": {
      "name": "Validate Deployment",
      "installs": "all"
    }
  }];

  env.deployedBranch = data.branch;
  let validKeys = [];

  try {
    await envService.update(env);

    // create redeploy task
    let validation = new Validation({
      name: 'Validate environment ' + env.envName,
      tasks: taskfactory.createTasks(selectedTasks),
      rundata: { me: env, options: {}},
      env: env
    });

    let validationId = await validationRunner.add(validation);
    await validation.start();
    return { validationId: validationId };
  } 
  catch(err) {
    debug('got error %s', err);
    throw err;
  }
};
