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
    $regionDesc: instance.regionDesc    
  };

  return this.run(sql, params, next);
};

RegionMapper.prototype.update = function update(instance, next) {
  var sql = machineSql.update
    , params
    ;

  params = {
    $regionId: instance.envId,
    $regionName: instance.regionName,
    $regionDesc: instance.regionDesc    
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