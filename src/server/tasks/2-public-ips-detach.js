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
    var ips = this.getData('ips');

    if(ips === 'all') {
      return detachAll()
    }
  };
}

util.inherits(TaskImplementation, Task);

module.exports = TaskImplementation;

function detachAll(scope, log) {

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
    var promises = scope.detachIps.map(function(detachIp) {    
      if(detachIp.ip) {
        var deferred = new Q.defer();
        var poll = function() {        
          setTimeout(function() {
            skytap.ips.detach(detachIp, function(err) {
              if(err) {
                log('error detaching ip: %j, will retry shortly', err);
                poll();
              } 
              else {
                log('ip successfully detached');
                deferred.resolve();
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
    .then(function() {
      log('all ips detached');
    }); 
  });

}