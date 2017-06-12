var debug           = require('debug')('deployer-regions')
  , Q               = require('q')
  , regionService   = require('../services/region-service')
  , envService      = require('../services/env-service')
  ;

exports.list = function region(req, res, next) {
  debug('listing environments for region');
  var regionId = req.params.regionId,
      page     = req.query.page,
      pagesize = req.query.pagesize
    ;
  envService
    .findByRegion(regionId, { page: page, pagesize: pagesize }, function(err, result) {
      res.result = result;
      res.err = err;
      next();
    });
};


exports.add = function add(req, res, next) {
  var regionId = req.params.regionId,
      envId    = req.params.envId
    ;
  regionService
    .addEnv(regionId, envId, function(err, result) {
      res.result  = result;
      res.err     = err;
      next();
    });
};


exports.remove = function remove(req, res, next) {
  var regionId = req.params.regionId,
      envId    = req.params.envId
    ;
  regionService
    .removeEnv(regionId, envId, function(err, result) {
      res.result  = result;
      res.err     = err;
      next();
    });
};