var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')

  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)

  , Task    = require('./task');


function TaskImplementation() {  
  Task.call(this);
  this.name = 'Detach public IPs';  

  this.execute = function execute(scope, log) {  

    return Q.fcall(function() {
      log('detaching public ip addresses');

      // get the ip addresses to detach
      scope.detachIps = scope.oldEnv.vms.map(function(vm) {
        var result = {
          vm_id: vm.id,
          interface_id: vm.interfaces[0].id,
          ip: null
        }        
        if(vm.interfaces[0].public_ips.length > 0) {
          result.ip = vm.interfaces[0].public_ips[0].id;
        }
        return result;
      });

      // perform the detaches
      return Q.all(scope.detachIps.map(function (detachIp) {          
        if(detachIp.ip) {
          log('detaching: %j', detachIp);
          return skytap.ips.detach(detachIp);
        }        
        return null;          
      }))
      .then(function() {
        log('all public ips detached');
      });    
    })
  };
}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;