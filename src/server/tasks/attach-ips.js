var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl() {  
  Task.call(this);
  this.name = 'Attach public IPs';  

  this.execute = function execute(scope, log) {  
    
    return Q.fcall(function() {
      log('attach public ip addresses');

      // get the ip addresses to attach
      scope.attachIps = scope.newEnv.vms.map(function(vm, idx) {
        var result = {
          vm_id: vm.id,
          interface_id: vm.interfaces[0].id,
          ip: (scope.detachIps[idx] ? scope.detachIps[idx].ip : null)
        }
        return result;
      });        
        
      // attach IPs  
      return Q.all(scope.attachIps.map(function(attachIp) {    
        if(attachIp.ip) {
          log('attaching: %j', attachIp);
          return skytap.ips.attach(attachIp);
        }
        return null;
      }))  
      .then(function() {
        log('all public ips attached');
      });
    });   
  }
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;
