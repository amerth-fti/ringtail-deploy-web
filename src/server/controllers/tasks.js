let debug   = require('debug')('deployer-tasks')
  , taskSvc = require('../services/task-service')
  ;        

exports.list = function list(req, res, next) {
  taskSvc.list(function(err, results) {
    res.result = results;
    res.err = err;
    next();
  });
};