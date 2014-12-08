var debug       = require('debug')('deployer-projects')  
  , Q           = require('q')
  , _           = require('underscore')
  , jobrunner  = require('../jobrunner');




exports.list = function list(req, res) {
  res.send(jobrunner.getJobs());
};



exports.get = function get(req, res) {
  var jobId = req.param('jobId');
  res.send(jobrunner.getJob(jobId));
};