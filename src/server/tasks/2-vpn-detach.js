var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl(options) {  
  this.name = 'Detach VPN';  
  Task.call(this, options);  

  this.execute = function execute(scope, log) {  
    var env = this.getData(scope, 'env');
    
    return Q.fcall(function() {
      log('removing vpn for %s', env.id);

      var network = env.networks[0]
        , attachment = network.vpn_attachments[0] ? network.vpn_attachments[0] : null
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
            });
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