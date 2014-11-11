var debug       = require('debug')('deployer-environments')  
  , Q           = require('q')  
  , Skytap      = require('node-skytap')
  , config      = require('../../../config')
  , tasks       = require('../tasks')  
  , taskrunner  = require('../taskrunner')
  , skytap  = Skytap.init(config.skytap);




exports.list = function list(req, res) {
  skytap.environments.list(function(err, envs) {
    if(err) res.status(500).send(err);
    else res.send(envs);
  });  
}



exports.get = function get(req, res) {
  var opts = {
    configuration_id: req.param('environmentId')
  };

  skytap.environments.get(opts, function(err, env) {
    if(err) res.status(500).send(err);
    else res.send(env);
  });
}



exports.start = function start(req, res) {
  var environmentId = req.param('environmentId') 
    , suspendOnIdle = req.param('suspend_on_idle')
    , opts;

  opts = {
    configuration_id: environmentId,
    suspend_on_idle: suspendOnIdle,
    runstate: 'running'
  };

  skytap.environments.update(opts, function(err, env) {
    if(err) res.status(500).send(err);
    else res.send(env);
  }); 
}



exports.pause = function pause(req, res) {
  var environmentId = req.param('environmentId')
    , opts;

  opts = {
    configuration_id: environmentId,
    runstate: 'suspended'
  };

  skytap.environments.update(opts, function(err, env) {
    if(err) res.status(500).send(err);
    else res.send(env);
  });
}



exports.redeploy = function redeploy(req, res) {
  debug('redeploy');

  var configuration_id = req.param('environmentId')
    , project_id = req.param('project_id')    
    , branch = req.param('branch')
    , task
    , taskId;

  // create redeploy task
  task = new tasks.RedeployTask({ 
    project_id: project_id,
    configuration_id: configuration_id,
    branch: branch
  });

  // enqueue task
  taskrunner.queue(task);

  // load the environment to send result
  skytap.environments.get({ configuration_id: configuration_id }, function(err, env) {
    if(err) res.status(500).send(err);
    else {

      // join the task before sending
      env.redeployTask = task
      res.send(env);
    }    
  });  
}