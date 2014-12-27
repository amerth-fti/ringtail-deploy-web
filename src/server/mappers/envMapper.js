var util          = require('util')
  , sqlite3       = require('sqlite3').verbose()
  , Q             = require('q')
  , statements    = require('statements')
  , SqliteMapper  = require('sweetener-sqlite')
  , envSql        = statements.read('environment.sql')
  ;



function EnvironmentMapper() {
  SqliteMapper.apply(this, arguments);
}
util.inherits(EnvironmentMapper, SqliteMapper);

EnvironmentMapper.prototype.parse = function(record) {
  
};


EnvironmentMapper.prototype.insert = function insert(env, next) {
  var sql = envSql.insert
    , params
    ;

  params = {
    $envId: env.envId,
    $envName: env.envName,
    $envDesc: env.envDesc,
    $remoteType: env.remoteType,
    $remoteId: env.remoteId,
    $configId: env.configId,
    $roleId: env.roleId,
    $deployedBy: env.deployedBy,
    $deployedOn: env.deployedOn,
    $deployedUntil: env.deployedUntil,
    $deployedNotes: env.deployedNotes,
    $deployedBranch: env.deployedBranch
  };

  return this.executeNonQuery(sql, params, next);
};

EnvironmentMapper.prototype.update = function update(env, next) {
var sql = envSql.update
    , params
    ;

  params = {
    $envId: env.envId,
    $envName: env.envName,
    $envDesc: env.envDesc,
    $remoteType: env.remoteType,
    $remoteId: env.remoteId,
    $configId: env.configId,
    $roleId: env.roleId,
    $deployedBy: env.deployedBy,
    $deployedOn: env.deployedOn,
    $deployedUntil: env.deployedUntil,
    $deployedNotes: env.deployedNotes,
    $deployedBranch: env.deployedBranch
  };

  return this.executeNonQuery(sql, params, next);
};


EnvironmentMapper.prototype.del = function del(envId, next) {
  var sql = envSql.delete
    , params;

  params = {
    $envId: envId
  };

  return this.executeNonQuery(sql, params, next);
};


EnvironmentMapper.prototype.findAll = function findAll(paging, next) {
  var sql = envSql.findAll
    , params
    ;

  params = {
    $pagesize: paging.pagesize,
    $offset: (paging.page - 1) * paging.pagesize
  };

  return this.executeReaderList(sql, params, next);
};

EnvironmentMapper.prototype.findById = function findById(envId, next) {
  var sql = envSql.findById
    , params
    ;

  params = {
    $envId: envId
  };

  return this.executeReader(sql, params, next);
};