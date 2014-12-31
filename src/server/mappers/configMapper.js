var util          = require('util')
  , Q             = require('q')
  , statements    = require('statements')
  , SqliteMapper  = require('hops-sqlite')
  , Config        = require('../models/config')
  , configSql     = statements.read(__dirname + '/sql/config.sql')
  ;



function ConfigMapper() {
  SqliteMapper.apply(this, arguments);
}
util.inherits(ConfigMapper, SqliteMapper);

module.exports = ConfigMapper;

ConfigMapper.prototype.parse = function parse(record) {
  return new Config(record);
};

ConfigMapper.prototype.parseArray = function parseArray(array) {
  var self = this;
  return array.map(function(record) {
    return new Config(record);
  });
};


ConfigMapper.prototype.insert = function insert(config, next) {
  var sql = configSql.insert
    , params    
    ;

  params = {    
    $configName: config.configName,
    $configDesc: config.configDesc,
    $configData: config.configData
  };

  return this.run(sql, params, next);
};

ConfigMapper.prototype.update = function update(config, next) {
var sql = configSql.update
    , params
    ;

  params = {    
    $configId: config.configId,
    $configName: config.configName,
    $configDesc: config.configDesc,
    $configData: config.configData
  };

  return this.run(sql, params, next);
};


ConfigMapper.prototype.del = function del(machineId, next) {
  var sql = configSql.delete
    , params;

  params = {
    $machineId: machineId
  };

  return this.run(sql, params, next);
};


ConfigMapper.prototype.findAll = function findAll(paging, next) {
  var sql = configSql.findAll
    , params
    ;

  params = {
    $pagesize: paging.pagesize,
    $offset: (paging.page - 1) * paging.pagesize
  };

  return this
    .all(sql, params)
    .then(this.parseArray)
    .nodeify(next);
};


ConfigMapper.prototype.findById = function findById(machineId, next) {
  var sql = configSql.findById
    , params
    ;

  params = {
    $machineId: machineId
  };

  return this
    .get(sql, params)
    .then(this.parse)
    .nodeify(next);
};