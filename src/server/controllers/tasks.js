var debug       = require('debug')('deployer-projects')  
  , Q           = require('q')
  , _           = require('underscore')
  , taskrunner  = require('../taskrunner');




exports.list = function list(req, res) {
  res.send(taskrunner.getTasks());
}



exports.get = function get(req, res) {
  var taskId = req.param('taskId');
  res.send(taskrunner.getTask(taskId));
}