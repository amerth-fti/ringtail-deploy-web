var util          = require('util')
  , Q             = require('q')
  , statements    = require('statements')
  , SqliteMapper  = require('hops-sqlite')
  , Region        = require('../models/region')
  , machineSql    = statements.read(__dirname + '/region.sql')
  ;



function RegionMapper() {
  SqliteMapper.apply(this, arguments);
}
util.inherits(RegionMapper, SqliteMapper);

module.exports = RegionMapper;

RegionMapper.prototype.parse = function parse(record) {
  var result = new Region(record);    
  result.serviceConfig = tryParseJSON(record.serviceConfig);
  result.browseConfig = tryParseJSON(record.browseConfig);
  return result;
};

RegionMapper.prototype.parseArray = function parseArray(array) {
  return array.map(this.parse.bind(this));
};


RegionMapper.prototype.insert = function insert(instance, next) {
  var sql = machineSql.insert
    , params
    ;

  params = {    
    $regionName: instance.regionName,
    $regionDesc: instance.regionDesc,
    $serviceConfig: stringifyJSON(instance.serviceConfig),
    $browseConfig: stringifyJSON(instance.browseConfig)
  };

  return this.run(sql, params, next);
};

RegionMapper.prototype.update = function update(instance, next) {
  var sql = machineSql.update
    , params
    ;

  params = {
    $regionId: instance.regionId,
    $regionName: instance.regionName,
    $regionDesc: instance.regionDesc,
    $serviceConfig: stringifyJSON(instance.serviceConfig),
    $browseConfig: stringifyJSON(instance.browseConfig)
  };

  return this.run(sql, params, next);
};


RegionMapper.prototype.del = function del(regionId, next) {
  var sql = machineSql.delete
    , params;

  params = {
    $regionId: regionId
  };

  return this.run(sql, params, next);
};


RegionMapper.prototype.findAll = function findAll(paging, next) {
  var sql = machineSql.findAll
    , params
    ;

  params = {
    $pagesize: paging.pagesize,
    $offset: (paging.page - 1) * paging.pagesize
  };

  return this
    .all(sql, params)
    .then(this.parseArray.bind(this))
    .nodeify(next);
};


RegionMapper.prototype.findById = function findById(regionId, next) {
  var sql = machineSql.findById
    , params
    ;

  params = {
    $regionId: regionId
  };

  return this
    .get(sql, params)
    .then(this.parse.bind(this))
    .nodeify(next);
};


RegionMapper.prototype.addEnv = function addEnv(regionId, envId, next) {
  var sql = machineSql.addEnv
    , params
    ;

  params = {
    $regionId: regionId,
    $envId: envId
  };

  return this
    .run(sql, params)
    .nodeify(next);
};


RegionMapper.prototype.removeEnv = function removeEnv(regionId, envId, next) {
  var sql = machineSql.removeEnv
    , params
    ;
    
  params = {
    $regionId: regionId,
    $envId: envId
  };

  return this
    .run(sql, params)
    .nodeify(next);
};

function tryParseJSON(string) {
  try {
    return JSON.parse(string);
  }
  catch(ex) {
    return {};
  }
}

function stringifyJSON(json) {
  return JSON.stringify(json, null, 2);
}