var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl(options) {  
  this.name = 'Wait';  
  Task.call(this, options);  

  this.validators.required.push('seconds');

  this.execute = function execute(scope, log) {  
    var deferred = Q.defer()
      , seconds = this.getData(scope, 'seconds');

    log('will wait for %d second', seconds);       
    
    setTimeout(function() {
      log('wait completed');
      deferred.resolve();
    }, seconds * 1000);

    return deferred.promise;
  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;