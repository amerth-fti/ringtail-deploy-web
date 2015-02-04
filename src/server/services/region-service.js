var debug         = require('debug')('deployer-region-service')
  , Q             = require('q')
  , RegionMapper  = require('../mappers/region-mapper')
  , Region        = require('../models/region')
  , dbPath        = __dirname + '/../../../data/deployer.db'
  , regionMapper  = new RegionMapper(dbPath)
  ;

exports.create = function create(data, next) {
  debug('creating region %j', data);
  var region = new Region(data);
  
  return region
    .validate()
    .then(function() {
      return regionMapper.insert(region);
    })
    .then(function(result) {
      debug('region %s created', result.lastID);
      region.regionId = result.lastID;
      return region;
    })
    .nodeify(next);
};

exports.update = function update(data, next) {
  debug('updating region %s', data.regionId);
  var region = new Region(data);

  return region
    .validate()
    .then(function() {
      return regionMapper.update(region);      
    })
    .then(function() {
      return region;
    })
    .nodeify(next);
};

exports.del = function del(regionId, next) {
  debug('deleting region %s', regionId);
  return regionMapper
    .del(regionId)    
    .nodeify(next);
};


exports.findAll = function findAll(paging, next) {
  debug('find all');
  paging = paging || {};
  paging.pagesize = paging.pagesize || 25;
  paging.page = paging.page || 1;

  return regionMapper
    .findAll(paging)
    .nodeify(next);
};

exports.findById = function findById(regionId, next) {
  debug('get region %s', regionId);
  return regionMapper
    .findById(regionId)
    .nodeify(next);
};

exports.addEnv = function addEnv(regionId, envId, next) {
  debug('add env %s to region %s', envId, regionId);
  return regionMapper
    .addEnv(regionId, envId)
    .nodeify(next);
};

exports.removeEnv = function removeEnv(regionId, envId, next) {
  debug('remove env %s from region %s', envId, regionId);
  return regionMapper
    .removeEnv(regionId, envId)
    .nodeify(next);
};