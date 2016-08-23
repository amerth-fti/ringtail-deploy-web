var debug       = require('debug')('deployer-projects')  
  , Q           = require('q')
  , _           = require('underscore')
  , jobrunner   = require('../jobrunner')
  , cheerio     = require('cheerio');


exports.list = function list(req, res) {
  res.send(jobrunner.getJobs());
};

exports.get = function get(req, res) {
  let jobId = req.param('jobId');
  jobrunner.getJob(jobId, function(err, data){
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

      for(task of data.tasks) {
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
          
          for(log of task.runlog) {
            formattedlog += log.date + ' - ' + log.data + '\n\n';
          }
        }

        if(task.tasks) {
          for(t of task.tasks) {
            formattedlog += 'TASK NAME: ' + t.name + '\n';
            formattedlog += 'STARTED: ' + t.started + '\n';
            formattedlog += 'ENDED: ' + t.endTime + '\n';
            formattedlog += 'STATUS: ' + t.status + '\n\n';
            
            if(t.runlog) {
              formattedlog += '############ERROR BLOCK############\n';
              for(subtask of t.runlog) {
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
              formattedlog += '############END ERROR BLOCK############\n';
              
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