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
    
    return Q.fcall(function() {
      log('attempting to remove vpn connection');

      var env = scope.newEnv
        , network = env.networks[0]
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
              if(err) {
                log('error detaching vpn: %j, will retry shortly', err);
                poll();
              } 
              else {
                log('vpn successfully detached');
                deferred.resolve();
              }
            })
          }, 15000);
        };

        poll();
        return deferred.promise;        
      }
    });   
  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;