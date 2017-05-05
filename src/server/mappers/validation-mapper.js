var util          = require('util')
  , debug         = require('debug')('deployer-jobmapper')
  , Q             = require('q')
  , statements    = require('statements')
  , SqliteMapper  = require('hops-sqlite')
  , Validation    = require('../models/validation')
  , validationSql = statements.read(__dirname + '/validation.sql')
  ;



function ValidationMapper() {
  SqliteMapper.apply(this, arguments);
}
util.inherits(ValidationMapper, SqliteMapper);

module.exports = ValidationMapper;

ValidationMapper.prototype.parseArray = function parseArray(array) {
  return array.map(this.parse);
};

ValidationMapper.prototype.insert = function insert(job, next) {
  var sql = validationSql.insert
    , params = {};

  params = {
    $jobId: job.jobId,
    $log: job.log
  };

  return this.run(sql, params, next);
};

ValidationMapper.prototype.update = function update(job, next) {
  var sql = validationSql.update
    , params = {};

  params = {
    $jobId: job.jobId,
    $log: job.log
  };

  return this.run(sql, params, next);
};

ValidationMapper.prototype.getById = function getById(jobId, next) {
  var sql = validationSql.getById
    , params = {
      $jobId: jobId
    };

  return this
    .get(sql, params)
    .then(function(row) {
      return row;
    })
    .nodeify(next);
};

ValidationMapper.prototype.list = function list(jobId, next) {
    var sql = validationSql.list
    , params = {}
    ;
  return this
    .all(sql)
    .then(this.parseArray.bind(this))
    .nodeify(next);
};

ValidationMapper.prototype.maxJobId = function(next){
  var sql = validationSql.maxid
    , params = {};

  return this
    .get(sql, params)
    .then(function(row) {
      return row.jobId;
    })
    .nodeify(next);
};

ValidationMapper.prototype.parse = function parse(record) {
  var result = new Validation(record);  
  result.log = result.log ? JSON.parse(result.log) : null;
  return result;
};

ValidationMapper.prototype.parseArray = function parseArray(array) {
  return array.map(this.parse);
};
