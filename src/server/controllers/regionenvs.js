var debug           = require('debug')('deployer-regions')
  , Q               = require('Q')
  , regionService   = require('../services/region-service')
  , envService      = require('../services/env-service')
  ;

exports.list = function region(req, res, next) {
  debug('listing environments for region');
  var regionId = req.param('regionId');
  envService
    .findByRegion(regionId, null, function(err, result) {
      res.result  = result;
      res.err     = err;
      next();
    });
};


exports.add = function add(req, res, next) {
  var regionId = req.param('regionId')
    , envId    = req.param('envId')
    ;
  regionService
    .addEnv(regionId, envId, function(err, result) {
      res.result  = result;
      res.err     = err;
      next();
    });
};


exports.remove = function remove(req, res, next) {
  var regionId = req.param('regionId')
    , envId    = req.param('envId')
    ;
  regionService
    .removeEnv(regionId, envId, function(err, result) {
      res.result  = result;
      res.err     = err;
      next();
    });
};