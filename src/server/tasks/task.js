var events  = require('events')
  , util    = require('util')
  , skytap  = require('node-skytap')
  , Q       = require('Q')
  , _       = require('underscore');


function Task(options) {
  events.EventEmitter.call(this);
  
  this.status = 'Pending';
  this.started = null;
  this.stopped = null;
  this.runlog = [];
  this.err = null;
  this.data = {};

  // apply options
  if(options) {
    for(var key in options) {
      if(options.hasOwnProperty(key)) {
        this[key] = options[key];
      }
    }
  }

  var self = this;  
  this.log = function log() {    

    // format the log data
    var data = util.format.apply(this, arguments);  

    // add data to the current task's log 
    self.runlog.push({ date: new Date(), data: data });  

    // emit that we had a log event  
    self.emit('log', data);
  };
}

util.inherits(Task, events.EventEmitter);

module.exports = Task;






Task.prototype.start = function start(scope) {
  this.started = new Date();  
  this.status = 'Running';
  this.emit('start', this);  
  var self = this;

  return Q.fcall(function() {
    return self.execute(scope, self.log);
  })
  .then(function(result) {    
    if(self.storeIn) {
      self.log('stroring scope variable "%s"', self.storeIn);
      scope[self.storeIn] = result;
    } else {
      self.log('no scope storage');
    }

  })
  .then(function() {    
    self.log('task complete');
    self.endTime = new Date();
    self.status = 'Succeeded';
    self.emit('success');
    self.emit('end');
  })
  .fail(function(err) {
    self.log(err);
    self.endTime = new Date();
    self.status = 'Failed';
    self.err = err;

    self.emit('fail', err);
    self.emit('end');
    throw err;
  });

};



Task.prototype.getData = function getData(scope, key, expand) {  
  try
  {
    if(expand)
      return getDataFromObject(scope, this.data, key);
    else  
      /*jshint es5:false */     
      /*jshint evil:true */
      return eval(this.data[key]);  
  }
  catch (ex) {    
    return this.data[key];
  }
};

function getDataFromObject(scope, obj, key) {    
  
  try
  {     
    /*jshint es5:false */
    /*jshint evil:true */      
    var val = eval(obj[key])
      , temp;
    
    if(Object.prototype.toString.call(val) === '[object Object]') {
      temp = {};

      /*jshint es5:false */
      /*jshint forin:false */
      for(var valkey in val) {
        temp[valkey] = getDataFromObject(scope, val, valkey);
      }
      val = temp;
    }    
    
    return val;
  }
  catch (ex) {    
    return obj[key];
  }
}