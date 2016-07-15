var util          = require('util')
  , Q             = require('q')
  , statements    = require('statements')
  , SqliteMapper  = require('hops-sqlite')
  , Job           = require('../models/job')
  , jobSql        = statements.read(__dirname + '/jobs.sql')
  ;



function JobMapper() {
  SqliteMapper.apply(this, arguments);
}
util.inherits(JobMapper, SqliteMapper);

module.exports = JobMapper;

JobMapper.prototype.parseArray = function parseArray(array) {
  return array.map(this.parse);
};

JobMapper.prototype.insert = function insert(job, next) {
  var sql = jobSql.insert
    , params = {};

  params = {
    $jobId: job.jobId,
    $log: job.log
  };

  return this.run(sql, params, next);
};

JobMapper.prototype.update = function update(job, next) {
  var sql = jobSql.update
    , params = {};

  params = {
    $jobId: job.jobId,
    $log: job.log
  };

  return this.run(sql, params, next);
};

JobMapper.prototype.getById = function getById(jobId, next) {
  var sql = jobSql.getById
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

JobMapper.prototype.maxJobId = function(next){
  var sql = jobSql.maxid
    , params = {};

  return this
    .get(sql, params)
    .then(function(row) {
      return row.jobId;
    })
    .nodeify(next);
};