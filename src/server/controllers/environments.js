var debug   = require('debug')('deployer-environments')  
  , Q       = require('q')  
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
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