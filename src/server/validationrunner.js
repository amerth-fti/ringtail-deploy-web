var debug   = require('debug')('deployer-validationrunner')
  , _       = require('underscore')
  , Q       = require('q')
  , cheerio = require('cheerio')
  , validations   = {}
  , validationId  = 0
  , ValidationMapper = require('./mappers/validation-mapper')
  , dbPath = __dirname + '/../../data/deployer.db'
  , validationMapper = new ValidationMapper(dbPath);


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
  * Helper for turning run details into an array, split by html tags and special delimiters.
  *       * 
  * @return [] run details
  */
 exports.convertdetailstoarray = function convertdetailstoarray(rundetails) {
  return arrayifyDetails(rundetails);
 };

//set job id to latest in db
validationMapper.maxJobId(function(err, id){
  validationId = id || 0;  
});

/** 
 * Gets all jobs by returning an array of jobs
 * 
 * @return {Array} array of jobs
 */
exports.getValidations = function getvalidations() {  
  return _.values(validations); 
};

/** 
 * Gets a job by the job identifier
 * 
 * @return {job} job instance
 */
exports.getValidation = function getvalidation(jobId, callback) {
  debug('getvalidation %j', jobId);
  if(jobId in validations) {
    var validation = validations[jobId];
    validation = parseRunDetails(validation);

    return callback(null, validations[jobId]);  
  }

  // validationMapper.getById(jobId, function(err, validation){
  //   if(!validation) validation = {};

  //   var validation = validation.log;
  //   debug('getById %j', validation);
  //   validation = parseRunDetails(validation);    

    
  //   validations[jobId] = validation;

  //   return callback(null, validation);
  // });  
};


/** 
 * Enqueue a job for processing by setting the status
 * and creating a job id. The job will run in the background
 * as a promise and will mark the job as complete or errored
 * depending on the outcome.
 *  
 * @return {Number} returns the jobId that was generated
 */
exports.add = function queue(validation) {
  debug('queing job');
  // increment job id 
  validation.id = (validationId += 1);
  validation.rundata.jobid = validation.id;
  
  // add to memory store
  validations[validation.id.toString()] = validation;

  return validation.id;
};