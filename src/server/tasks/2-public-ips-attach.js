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
    var env = this.getData(scope, 'env')
      , ips = this.getData(scope, 'ips');

    return Q.fcall(function() {
      log('attaching public ips %j for %s', ips, env.id);

      // get the ip addresses to attach
      var attachIps = env.vms.map(function(vm, idx) {
        return {
          vm_id: vm.id,
          interface_id: vm.interfaces[0].id,
          ip: ips[idx]
        };
      });        
        
      // attach IPs  
      var promises = attachIps.map(function(attachIp) {            
        if(attachIp.ip) {
          var deferred = new Q.defer();
          var poll = function() {        

            setTimeout(function() {
              log('attempting to attach ip %s', attachIp.ip);              
              skytap.ips.attach(attachIp, function(err) {
                if(err) { console.log(err); poll(); }
                else {
                  log('ip %s attached', attachIp.ip);
                  deferred.resolve(attachIp.ip);
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
      log('all ips attached');
      return ips;
    });
  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;
