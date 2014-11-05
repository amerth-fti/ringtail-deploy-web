var debug   = require('debug')('deployer-environments')
  , _       = require('underscore')
  , Q       = require('q')
  , skytap  = require('node-skytap')
  , config  = require('../../../config');



exports.list = function list(req, res) {
  var opts = _.clone(config.skytap);

  skytap.environments.list(opts, function(err, envs) {
    if(err) res.status(500).send(err);
    else res.send(envs);
  });  
}



exports.get = function get(req, res) {
  var opts = _.clone(config.skytap);

  opts.params = {
    id: req.param('environmentId')
  };

  skytap.environments.get(opts, function(err, env) {
    if(err) res.status(500).send(err);
    else res.send(env);
  });
}



exports.start = function start(req, res) {
  var environmentId = req.param('environmentId') 
    , suspendOnIdle = req.param('suspend_on_idle')
    , opts = _.clone(config.skytap);

  opts.params = {
    id: environmentId,
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
    , opts = _.clone(config.skytap);

  opts.params = {
    id: environmentId,
    runstate: 'suspended'
  };

  skytap.environments.update(opts, function(err, env) {
    if(err) res.status(500).send(err);
    else res.send(env);
  });
}