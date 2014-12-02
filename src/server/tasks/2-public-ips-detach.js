var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')

  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)

  , Task    = require('./task');


function TaskImplementation(options) {    
  this.name = 'Detach public IPs';
  Task.call(this, options);  

  this.execute = function execute(scope, log) {  
    var configuration_id = this.getData(scope, 'configuration_id');
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
      log('detaching public ip addresses');

      // get the ip addresses to detach
      detachIps = env.vms.map(function(vm, idx) {
        return {
          vm_id: vm.id,
          interface_id: vm.interfaces[0].id,
          ip: ips[idx]
        };
      });

      // perform the detaches
      var promises = detachIps.map(function(detachIp) {    
        if(detachIp.ip) {
          var deferred = new Q.defer();
          var poll = function() {        
            setTimeout(function() {
              log('detaching ip %s', detachIp.ip);
              skytap.ips.detach(detachIp, function(err) {
                if(err) poll();
                else {
                  log('ip %s detached', detachIp.ip);
                  deferred.resolve(detachIp.ip);
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

      return Q.all(promises)
    })

    .then(function(ips) {
      log('all ips detached');
      return ips;
    });

  };
}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;