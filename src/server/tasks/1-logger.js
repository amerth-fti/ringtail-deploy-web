var util    = require('util')  
  , Q       = require('q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl(options) {  
  this.name = 'Log';  
  Task.call(this, options);

  this.validators.required.push('message');
  
  this.execute = function execute(scope, log) {  
    var message = this.getData(scope, 'message');
        
    log(message);    
  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;