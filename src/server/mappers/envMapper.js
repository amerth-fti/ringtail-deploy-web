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
  var result = new Env(record);
  result.config = tryParseConfig(result.config);
  return result;
};

EnvMapper.prototype.parseArray = function parseArray(array) {  
  return array.map(this.parse);
};


EnvMapper.prototype.insert = function insert(env, next) {
  var sql = envSql.insert
    , params
    ;

  params = {
    $envId: env.envId,
    $envName: env.envName,
    $envDesc: env.envDesc,
    $status: env.status,
    $remoteType: env.remoteType,
    $remoteId: env.remoteId,
    $config: stringifyConfig(env.config),
    $deployedBy: env.deployedBy,
    $deployedOn: env.deployedOn,
    $deployedUntil: env.deployedUntil,
    $deployedNotes: env.deployedNotes,
    $deployedBranch: env.deployedBranch,
    $deployedJobId: env.deployedJobId,
    $host: env.host
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
    $status: env.status,
    $remoteType: env.remoteType,
    $remoteId: env.remoteId,
    $config: stringifyConfig(env.config),
    $deployedBy: env.deployedBy,
    $deployedOn: env.deployedOn,
    $deployedUntil: env.deployedUntil,
    $deployedNotes: env.deployedNotes,
    $deployedBranch: env.deployedBranch,
    $deployedJobId: env.deployedJobId,
    $host: env.host
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
    .then(this.parseArray.bind(this))
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


function tryParseConfig(string) {
  try {
    return JSON.parse(string);
  }
  catch(ex) {
    return {};
  }
}

function stringifyConfig(json) {
  return JSON.stringify(json, null, 2);
}