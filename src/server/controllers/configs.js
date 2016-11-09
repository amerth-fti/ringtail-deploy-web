let debug = require('debug')('deployer-configs')  
  , Q     = require('q')
  , _     = require('underscore')
  , configSvc = require('../services/config-service')
  , launchKeySvc = require('../services/launchkey-service')  
  ;

exports.findByEnv = function findByenv(req, res, next) {
  let envId = req.params.envId;
  configSvc.findByEnv(envId, function(err, configs) {
    res.result  = configs;
    res.err     = err;
    next();    
  }); 
};

exports.launchKeys = function launchKeys(req, res, next) {
  let envId = req.params.envId,
    branch = req.params.branch,
    data = {envId: envId, branch: branch};
    launchKeySvc.requestLaunchKeys(data, function(err, keys) {
      res.result  = keys;
      res.err     = err;
      next();   
    });
};

exports.litKeys = function litKeys(req, res, next) {
  let envId = req.params.envId,
    branch = req.params.branch,
    data = {envId: envId, branch: branch};
    launchKeySvc.getLitKeys(data, function(err, keys) {
      let result = keys;
      res.result  = result;
      res.err     = err;
      next();   
    });
};

exports.sendLaunchKeys = function sendLaunchKeys(req, res, next) {
  let body = req.body,
    envId = body.envId,
    launchKeys = body.launchKeys,
    data = {envId: envId, launchKeys: launchKeys};

  launchKeySvc.sendLaunchKeys(data, function(err, keys) {
    res.result  = keys;
    res.err     = err;
    next();   
  });
};

exports.create = function create(req, res, next) {
  let config = req.body;
  configSvc.create(config, function(err, config) {
    res.result = config;
    res.err    = err;
    next();
  });
};

exports.update = function update(req, res, next) {
  let config = req.body;
  configSvc.update(config, function(err, config) {
    res.result = config;
    res.err    = err;
    next();
  });
};

exports.del = function del(req, res, next) {
  let configId = req.params.configId;
  configSvc.del(configId, function(err, result) { 
    res.result = result;
    res.err    = err;
    next();
  });
};