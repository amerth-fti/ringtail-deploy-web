var debug = require('debug')('deployer-configs')  
  , Q     = require('q')
  , _     = require('underscore')
  , configSvc = require('../services/config-service')
  ;

exports.findByEnv = function findByenv(req, res, next) {
  var envId = req.params.envId;
  configSvc.findByEnv(envId, function(err, configs) {
    res.result  = configs;
    res.err     = err;
    next();    
  }); 
};

exports.create = function create(req, res, next) {
  var config = req.body;
  configSvc.create(config, function(err, config) {
    res.result = config;
    res.err    = err;
    next();
  });
};

exports.update = function update(req, res, next) {
  var config = req.body;
  configSvc.update(config, function(err, config) {
    res.result = config;
    res.err    = err;
    next();
  });
};

exports.del = function del(req, res, next) {
  var configId = req.params.configId;
  configSvc.del(configId, function(err, result) { 
    res.result = result;
    res.err    = err;
    next();
  });
};