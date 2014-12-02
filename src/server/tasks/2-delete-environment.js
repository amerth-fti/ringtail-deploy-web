var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl(options) {  
  this.name = 'Deleting old environment';  
  Task.call(this, options);  

  this.execute = function execute(scope, log) {  
    var configuration_id = this.getData(scope, 'configuration_id');

    return Q.fcall(function() {
      log('deleting environment %s', configuration_id);    
      return skytap.environments.del({ configuration_id: configuration_id })    ;
    })

    .then(function() {
      log('environment %s deleted', configuration_id);
    });

  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;