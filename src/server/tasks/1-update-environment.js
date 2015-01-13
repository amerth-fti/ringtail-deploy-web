var util        = require('util')  
  , Q           = require('Q')
  , _           = require('underscore')
  , config      = require('../../../config')
  , envService  = require('../services/envService')
  , Task        = require('./task');


function TaskImpl(options) {  
  this.name = 'Update environment';  
  Task.call(this, options);

  this.execute = function execute(scope, log) {  
    var update = this.getData(scope, 'update', true)
      , key;
        
    for(key in update) {
      if(update.hasOwnProperty(key)) {
        scope.me[key] = update[key];      
      }
    }

    return envService.update(scope.me);
  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;