var events  = require('events')
  , util    = require('util')
  , skytap  = require('node-skytap')
  , Q       = require('Q')
  , _       = require('underscore');


function Task() {
  events.EventEmitter.call(this);

  this.name = null;  
  this.status = 'Pending'
  this.started = null;
  this.stopped = null;
  this.runlog = [];
  this.err = null;

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

  return this.execute(scope, this.log)
  .then(function() {    
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

}