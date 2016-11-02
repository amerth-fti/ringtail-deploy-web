let debug       = require('debug')('deployer-projects');
let Q           = require('q');
let _           = require('underscore');
let jobrunner   = require('../jobrunner');
let cheerio     = require('cheerio');
let jobservice  = require('../services/job-service');

exports.list = (req, res) => {
  let jobs = jobrunner.getJobs();
  debug('jobs - ' + jobs.length);
  res.send(jobs);
};

exports.summaryList = function summaryList(req, res, next) {
  let timeframe = req.params.last;

  if(!timeframe || timeframe == 0) {
    timeframe = 365;
  }
  jobservice.list(null, function(err, result) {
    let friendlyResult = _.map(result, function(job) {
      return {id: job.log.id, status: job.log.status, started: job.log.started, stopped: job.log.stopped};
    });

    let jobsSince = new Date();
    jobsSince = jobsSince.setDate(jobsSince.getDate() - timeframe);

    let recent = _.filter(friendlyResult, function(item) {
      return Date.parse(item.started) > jobsSince;
    });
    let successRates = _.countBy(recent, 'status');         // count by status, so we can see how many jobs succeed.
    let jobsOverTime = _.countBy(recent, function(job) {    // count by days, so we can see how many jobs run per day.
      let date = new Date(Date.parse(job.started));
      return (date.getMonth() + 1) + '-' + date.getDate();
    });

    res.result = {successRates: successRates, jobsOverTime: jobsOverTime};
    res.err = err;
    next();
  });
};

exports.get = (req, res) => {
  let jobId = req.param('jobId');

  jobrunner.getJob(jobId, (err, data) => {
    res.send(data);
  });
};

exports.downloadLog = function downloadLog(req, res) {
  let jobId = req.param('jobId');

  jobrunner.getJob(jobId, function(err, data){
    let filename = 'deployer.' +jobId + '.log.txt';
    let formattedlog = '';
    let content = data;

    try {
      content = JSON.stringify(content, null, 4);

      for(let task of data.tasks) {
        formattedlog += 'JOB ID: ' + task.id + '\n';
        formattedlog += 'TASK NAME: ' + task.name + '\n';
        formattedlog += 'STARTED: ' + task.started + '\n';
        formattedlog += 'ENDED: ' + (task.stopped||task.endTime) + '\n';
        formattedlog += 'STATUS: ' + task.status + '\n\n';

        if(task.taskdefs) {
          formattedlog += 'TASK DEFINITIONS:\n';
          formattedlog += JSON.stringify(task.taskdefs, null, 4) + '\n\n';
        }

        if(task.runlog) {
          formattedlog += 'RUNLOG:\n';
          
          for(let log of task.runlog) {
            formattedlog += log.date + ' - ' + log.data + '\n\n';
          }
        }

        if(task.tasks) {
          for(let t of task.tasks) {
            formattedlog += 'TASK NAME: ' + t.name + '\n';
            formattedlog += 'STARTED: ' + t.started + '\n';
            formattedlog += 'ENDED: ' + t.endTime + '\n';
            formattedlog += 'STATUS: ' + t.status + '\n\n';
            
            if(t.runlog) {
              formattedlog += '############RUN LOG BLOCK############\n';
              for(let subtask of t.runlog) {
                formattedlog += subtask.date + ' - ';
                let data = subtask.data;

                if(/\<p\>/i.test(data)) {
                  let $ = cheerio.load(data);                
                  data = '';

                  $('p').each((i, elem) => {
                    data += $(elem).html() + '\n';
                  });
                }
                
                formattedlog += data + '\n\n';
              }
              formattedlog += '############RUN LOG BLOCK############\n';
              
            }
          }
        }

        formattedlog += '-------------------------------------------------\n\n';
      }

    } catch(err) {}

    res.set({'Content-Disposition':'attachment; filename=\'' + filename + '\''});
   	res.send(formattedlog);
  });
};