var debug         = require('debug')('deployer-task-service')
  , fs            = require('fs')
  , path          = require('path')
  , Q             = require('q')
  , taskfactory   = require('../taskfactory')
  ;

exports.list = function(next) {
  var deferred = Q.defer()
    , tasksRootPath = path.resolve(__dirname, '../tasks')
    ;

  fs.readdir(tasksRootPath, function(err, files) {
    if(err) {
      deferred.reject(err);
    }

    var tasks = files.map(function(file) {
      var ext, name, task;

      ext = path.extname(file);
      name = file.substring(0, file.length - ext.length);
      
      task = taskfactory.createTask({ task: name });
      return {
        name: name,
        data: task.validators.required
      };
    });
    
    deferred.resolve(tasks);
  });


  return deferred
    .promise
    .nodeify(next);

};