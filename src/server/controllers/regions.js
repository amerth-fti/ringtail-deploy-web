var debug           = require('debug')('deployer-regions')
  , Q               = require('Q')
  , regionService   = require('../services/region-service')
  ;


exports.list = function list(req, res, next) {
  debug('listing regions');
  regionService
    .findAll(null, function(err, result) {
      res.result = result;
      res.err = err;
      next();
    });
};


exports.get = function get(req, res, next) {
  debug('getting region');
  var regionId = req.param('regionId');
  regionService
    .findById(regionId, function(err, result) {
      res.result  = result;
      res.err     = err;
      next();
    });   
};


exports.create = function create(req, res, next) {
  debug('creating region');
  var data = req.body;
  regionService
    .create(data, function(err, result) {
      res.result = result;
      res.err = err;
      next();
    });
};

exports.update = function update(req, res, next) {
  debug('updating region');
  var data = req.body;
  regionService
    .update(data, function(err, result) {
      res.result = result;
      res.err = err;
      next();
    });
};

exports.del = function del(req, res, next) {
  debug('deleting region');
  var id = req.param('regionid');
  regionService
    .del(id, function(err, result) {
      res.result = result;
      res.err = err;
      next();
    });
};