var util          = require('util')
  , Q             = require('q')
  , statements    = require('statements')
  , SqliteMapper  = require('hops-sqlite')
  , Config        = require('../models/config')
  , configSql     = statements.read(__dirname + '/config.sql')
  ;



function ConfigMapper() {
  SqliteMapper.apply(this, arguments);
}
util.inherits(ConfigMapper, SqliteMapper);

module.exports = ConfigMapper;

ConfigMapper.prototype.parse = function parse(record) {
  var result = new Config(record);
  result.data = result.data ? JSON.parse(result.data) : null;
  result.roles = result.roles ? JSON.parse(result.roles) : null;
  return result;
};

ConfigMapper.prototype.parseArray = function parseArray(array) {
  return array.map(this.parse.bind(this));
};


ConfigMapper.prototype.insert = function insert(config, next) {
  var sql = configSql.insert
    , params
    ;

  params = {
    $configId: config.configId,
    $configName: config.configName,
    $data: config.data ? JSON.stringify(config.data, null, 2) : null,
    $roles: config.roles ? JSON.stringify(config.roles, null, 2) : null,
    $envId: config.envId
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
    $data: config.data ? JSON.stringify(config.data, null, 2) : null,
    $roles: config.roles ? JSON.stringify(config.roles, null, 2) : null,
    $envId: config.envId
  };

  return this.run(sql, params, next);
};


ConfigMapper.prototype.del = function del(configId, next) {
  var sql = configSql.delete
    , params;

  params = {
    $configId: configId
  };

  return this.run(sql, params, next);
};


ConfigMapper.prototype.findByEnv = function findByEnv(envId, next) {
  var sql = configSql.findByEnv
    , params
    ;

  params = {
    $envId: envId
  };

  return this
    .all(sql, params)
    .then(this.parseArray.bind(this))
    .nodeify(next);
};


ConfigMapper.prototype.findById = function findById(configId, next) {
  var sql = configSql.findById
    , params
    ;

  params = {
    $configId: configId
  };

  return this
    .get(sql, params)
    .then(this.parse.bind(this))
    .nodeify(next);
};