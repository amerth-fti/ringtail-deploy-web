var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl() {  
  Task.call(this);
  this.name = 'Suspend old environment';  

  this.execute = function execute(scope, log) {  
    
    return Q.fcall();    
  }
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;