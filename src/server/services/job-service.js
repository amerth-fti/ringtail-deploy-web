var debug       = require('debug')('deployer-jobservice')
  , _           = require('underscore')
  , Q           = require('q')
  , JobMapper   = require('../mappers/jobs-mapper')
  , dbPath      = __dirname + '/../../../data/deployer.db'
  , jobMapper   = new JobMapper(dbPath);

/** 
 * Gets all jobs by returning an array of jobs
 * 
 * @return {Array} array of jobs
 */
exports.list = function list(blah, next) {  
  return jobMapper.list()
    .nodeify(next);

  // var jobs = jobMapper.list(null, function(err, jobs){
  //   return callback(null, jobs);
  // });
};