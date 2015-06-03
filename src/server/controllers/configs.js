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