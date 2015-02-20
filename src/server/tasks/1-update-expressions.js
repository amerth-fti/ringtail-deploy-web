var util        = require('util')  
  , Q           = require('Q')
  , _           = require('underscore')
  , envSvc      = require('../services/env-service')  
  , Task        = require('./task')
  ;


function TaskImpl(options) {  
  this.name = 'Update environment';  
  Task.call(this, options);

  this.validators.required.push('update');
  this.validators.required.push('env');

  this.execute = function execute(scope, log) {          
    var self = this;

    return Q.fcall(function() {
      log('executing all update expressions');
      
      var update = self.getData(scope, 'update', true)
        , env = self.getData(scope, 'env');
      
      log('saving environment changes');
      return envSvc.update(env);
    });

  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;