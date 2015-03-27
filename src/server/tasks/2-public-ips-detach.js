var util    = require('util')  
  , Q       = require('q')
  , _       = require('underscore')

  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)

  , Task    = require('./task');


function TaskImplementation(options) {    
  this.name = 'Detach public IPs';
  Task.call(this, options);  

  this.validators.required.push('env');

  this.execute = function execute(scope, log) {  
    var env = this.getData(scope, 'env')
      , detachIps;

    return Q.fcall(function() {
      log('detaching public ip for %s', env.id);      

      // get the ip addresses to detach
      detachIps = env.vms.map(function(vm, idx) {
        var result = {
          vm_id: vm.id,
          interface_id: vm.interfaces[0].id,
          ip: null
        };   
        if(vm.interfaces[0].public_ips.length > 0) {
          result.ip = vm.interfaces[0].public_ips[0].id;
        }
        return result;
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
              });
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
      log('all ips detached');
      return ips;
    });

  };
}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;