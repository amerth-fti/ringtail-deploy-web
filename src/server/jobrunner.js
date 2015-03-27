
var debug   = require('debug')('deployer-jobrunner')
  , _       = require('underscore')
  , Q       = require('q')
  , jobs   = {}
  , jobId  = 0;


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
exports.getJob = function getjob(jobId) {
  return jobs[jobId];
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