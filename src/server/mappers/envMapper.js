var util          = require('util')  
  , Q             = require('q')
  , statements    = require('statements')
  , SqliteMapper  = require('hops-sqlite')
  , Env           = require('../models/env')
  , envSql        = statements.read(__dirname + '/env.sql')
  ;



function EnvMapper() {
  SqliteMapper.apply(this, arguments);
}
util.inherits(EnvMapper, SqliteMapper);

module.exports = EnvMapper;

EnvMapper.prototype.parse = function parse(record) {
  return new Env(record);
};

EnvMapper.prototype.parseArray = function parseArray(array) {
  var self = this;
  return array.map(function(record) {
    return new Env(record);
  });
};


EnvMapper.prototype.insert = function insert(env, next) {
  var sql = envSql.insert
    , params
    ;

  params = {
    $envId: env.envId,
    $envName: env.envName,
    $envDesc: env.envDesc,
    $remoteType: env.remoteType,
    $remoteId: env.remoteId,
    $config: env.config,
    $deployedBy: env.deployedBy,
    $deployedOn: env.deployedOn,
    $deployedUntil: env.deployedUntil,
    $deployedNotes: env.deployedNotes,
    $deployedBranch: env.deployedBranch
  };

  return this.run(sql, params, next);
};

EnvMapper.prototype.update = function update(env, next) {
var sql = envSql.update
    , params
    ;

  params = {
    $envId: env.envId,
    $envName: env.envName,
    $envDesc: env.envDesc,
    $remoteType: env.remoteType,
    $remoteId: env.remoteId,
    $config: env.config,
    $deployedBy: env.deployedBy,
    $deployedOn: env.deployedOn,
    $deployedUntil: env.deployedUntil,
    $deployedNotes: env.deployedNotes,
    $deployedBranch: env.deployedBranch
  };

  return this.run(sql, params, next);
};


EnvMapper.prototype.del = function del(envId, next) {
  var sql = envSql.delete
    , params;

  params = {
    $envId: envId
  };

  return this.run(sql, params, next);
};


EnvMapper.prototype.findAll = function findAll(paging, next) {
  var sql = envSql.findAll
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

EnvMapper.prototype.findById = function findById(envId, next) {
  var sql = envSql.findById
    , params
    ;

  params = {
    $envId: envId
  };

  return this
    .get(sql, params)
    .then(this.parse)
    .nodeify(next);
};