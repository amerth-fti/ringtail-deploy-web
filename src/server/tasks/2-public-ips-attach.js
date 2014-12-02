var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl(options) {  
  this.name = 'Attach public IPs';
  Task.call(this, options);

  this.execute = function execute(scope, log) {  
    var configuration_id = this.getData(scope, 'configuration_id')
      , ips = this.getData(scope, 'ips');


    return Q.fcall(function() {
      log('getting vms for environment %s', configuration_id);
      return skytap.environments.get({ configuration_id: configuration_id })
    })

    .then(function(env) {
      log('found %d vms', env.vms.length);
      return evn;
    })

    .then(function(env) {
      log('attaching public ip addresses');

      // get the ip addresses to attach
      var attachIps = env.vms.map(function(vm, idx) {
        return {
          vm_id: vm.id,
          interface_id: vm.interfaces[0].id,
          ip: ips[idx]
        };
      });        
        
      // attach IPs  
      var promises = sattachIps.map(function(attachIp) {            
        if(attachIp.ip) {
          var deferred = new Q.defer();
          var poll = function() {        
            setTimeout(function() {
              log('attaching ip %s', attachIp.ip);
              skytap.ips.attach(attachIp, function(err) {
                if(err) poll();
                else {
                  log('ip %s attached', attachIp.ip);
                  deferred.resolve(ip);
                }
              })
            }, 5000);
          };
          poll();
          return deferred.promise;
        }
        else {
          return null;
        }
      });

      return Q.all(promises);

    })

    .then(function(ips) {
      log('all ips attached');
      return ips;
    });
  }
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;
