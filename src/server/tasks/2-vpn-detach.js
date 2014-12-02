var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl() {  
  Task.call(this);
  this.name = 'Detach VPN';  

  this.execute = function execute(scope, log) {  
    var configuration_id = this.getData(scope, 'configuration_id');

    return Q.fcall(function() {
      log('getting vms for environment %s', configuration_id);
      return skytap.environments.get({ configuration_id: configuration_id })
    })

    .then(function(env) {
      log('found %d vms', env.vms.length);
      return evn;
    })
  
    .then(function(env) {
      log('removing vpn connections');

      var network = env.networks[0]
        , attachment = network.vpn_attachments[0]
        , vpn = attachment ? attachment.vpn : null
        , opts
        , deferred = Q.defer();

      if(vpn) {
        log('removing vpn %s', vpn.id);
        
        opts = { 
          configuration_id: env.id,
          network_id: network.id,
          vpn_id: vpn.id
        };

        var poll = function() {        
          setTimeout(function() {
            skytap.vpns.detach(opts, function(err) {
              if(err) poll();              
              else {
                log('vpn %s successfully detached', vpn.id);
                deferred.resolve(vpn.id);
              }
            })
          }, 5000);
        };

        poll();
        return deferred.promise;
      }
    });
        
  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;