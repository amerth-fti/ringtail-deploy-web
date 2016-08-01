
var debug   = require('debug')('deployer-jobrunner')
  , _       = require('underscore')
  , Q       = require('q')
  , cheerio = require('cheerio')
  , jobs   = {}
  , jobId  = 0
  , JobMapper = require('./mappers/jobs-mapper')
  , dbPath = __dirname + '/../../data/deployer.db'
  , jobMapper = new JobMapper(dbPath);


var arrayifyDetails = function(rundetails) {
  try {
    var $ = cheerio.load(rundetails);

    var buffer = '';
    var detailsArray = [];

    $('p').each(function(i, elem){
      var text = $(this).text().trim();
      
      if(text == '-----------') {
        detailsArray.push(buffer);
        buffer = '';
      } else {
        buffer += $.html(this);
      }
    });

    if(buffer) { 
      detailsArray.push(buffer);
    }
  }
  catch(err) {
    console.error(err);
  }

  return detailsArray;
};

var parseRunDetails = function(job) {
  try {
    if(typeof job == 'string') {
      job = JSON.parse(job);    
    }
  } catch(err) {
    console.error('parseRunDetails: JSON.parse failed');
  }
  if(job && job.tasks) {
    job.tasks.forEach(function(task){
      if(task && task.tasks) {
        task.tasks.forEach(function(t){
          if(t && t.rundetails) {
            t.runlogArray = arrayifyDetails(t.rundetails);
          }
        });
      }
    });
  }
  return job;
};

/** 
 * 
 */
 exports.convertdetailstoarray = function convertdetailstoarray(rundetails) {
  return arrayifyDetails(rundetails);
 };

//set job id to latest in db
jobMapper.maxJobId(function(err, id){
  jobId = id || 0;  
});

/** 
 * Gets all jobs by returning an array of jobs
 * 
 * @return {Array} array of jobs
 */
exports.getJobs = function getjobs() {  
  return _.values(jobs); 
};



/** 
 * Gets a job by the job identifier
 * 
 * @return {job} job instance
 */
exports.getJob = function getjob(jobId, callback) {
  if(jobId in jobs) {
    var job =  jobs[jobId];
    job = parseRunDetails(job);

    return callback(null, jobs[jobId]);  
  }

  jobMapper.getById(jobId, function(err, job){
    if(!job) job = {};

    var job = job.log;
    job = parseRunDetails(job);    

    jobs[jobId] = job;

    return callback(null, job);
  });  
};


/** 
 * Enqueue a job for processing by setting the status
 * and creating a job id. The job will run in the background
 * as a promise and will mark the job as complete or errored
 * depending on the outcome.
 *  
 * @return {Number} returns the jobId that was generated
 */
exports.add = function queue(job) {

  // increment job id 
  job.id = (jobId += 1);
  job.rundata.jobid = job.id;
  
  // add to memory store
  jobs[job.id.toString()] = job;

  return job.id;
};