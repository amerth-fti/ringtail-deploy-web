var debug       = require('debug')('deployer-environments')  
  , Q           = require('q')  
  , _           = require('underscore')
  , Skytap      = require('node-skytap')
  , config      = require('../../../config')
  , Job         = require('../job')  
  , jobrunner   = require('../jobrunner')
  , taskfactory = require('../taskfactory')
  , skytap  = Skytap.init(config.skytap);




exports.list = function list(req, res) {
  skytap.environments.list()
  .then(function (envs) {
    return joinUserData(envs);    
  })
  .then(function(envs) {    
    res.send(envs);  
  })
  .fail(function(err){
    res.status(500).send(err);
  });
};



exports.get = function get(req, res) {
  var opts = {
    configuration_id: req.param('environmentId')
  };

  skytap.environments.get(opts)
  .then(function (env) {
    return joinUserData(env);    
  })
  .then(function(env) {    
    res.send(env);  
  })
  .fail(function(err){
    res.status(500).send(err);
  });
};


exports.update = function update(req, res) {

  var configuration_id = req.param('environmentId')
    , name = req.body.name
    , description = req.body.description
    , user_data_contents = req.body.user_data.contents;


  skytap.environments.update({
    configuration_id: configuration_id,
    name: name,
    description: description
  })  
  .then(function (env) {    
    return skytap.environments.updateUserdata({ 
      configuration_id: configuration_id,
      contents: user_data_contents
    })    
    .then(function() { return env; });
  })
  .then(function (env) {
    return joinUserData(env);
  })
  .then(function(env) {    
    res.send(env);  
  })
  .fail(function(err){
    res.status(500).send(err);
  });
};



exports.start = function start(req, res) {
  var environmentId = req.param('environmentId') 
    , suspendOnIdle = req.param('suspend_on_idle')
    , opts;

  opts = {
    configuration_id: environmentId,
    suspend_on_idle: suspendOnIdle,
    runstate: 'running'
  };

  skytap.environments.update(opts)
  .then(function (env) {
    return joinUserData(env);    
  })
  .then(function(env) {    
    res.send(env);  
  })
  .fail(function(err){
    res.status(500).send(err);
  });
};



exports.pause = function pause(req, res) {
  var environmentId = req.param('environmentId')
    , opts;

  opts = {
    configuration_id: environmentId,
    runstate: 'suspended'
  };

  skytap.environments.update(opts)
  .then(function (env) {
    return joinUserData(env);    
  })
  .then(function(env) {    
    res.send(env);  
  })
  .fail(function(err){
    res.status(500).send(err);
  });
};


exports.stop = function stop(req, res) {
  var environmentId = req.param('environmentId')
    , opts;

  opts = {
    configuration_id: environmentId,
    runstate: 'stopped'
  };

  skytap.environments.update(opts)
  .then(function (env) {
    return joinUserData(env);    
  })
  .then(function(env) {    
    res.send(env);  
  })
  .fail(function(err){
    res.status(500).send(err);
  });
};



exports.redeploy = function redeploy(req, res) {
  debug('redeploy');

  var configuration_id = req.param('environmentId')  
    , job
    , jobId
    , environment = req.body    
    , deployment = req.param('deployment')    
    , taskdefs = deployment.taskdefs
    , rundata;

  rundata = { 
    me: environment,
    deployment: deployment
  };
  rundata = _.extend(rundata, req.query);
  console.log(rundata);

  // create redeploy task
  job = new Job({
    name: 'Redeploy environment ' + environment.name,
    tasks: taskfactory.createTasks(taskdefs),
    rundata: rundata
  });

  // enqueue task  
  jobId = jobrunner.add(job);

  // start the job
  job.start();

  res.send({ jobId: jobId });
};



/**
 * Joins the userdata for the env/envs
 *
 * @praram {Environment/Array[Environment]} data
 * @return {Promise}
 * @api private
 */
function joinUserData(data) {

  var join = function(env) {
    return skytap.environments.userdata({configuration_id: env.id})
    .then(function(userdata) {
      env.user_data = userdata;
      return env;
    });
  };

  if(Array.isArray(data)) {
    return Q.all(data.map(join));
  } else {
    return join(data);
  }
}