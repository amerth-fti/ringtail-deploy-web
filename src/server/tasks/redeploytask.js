var debug   = require('debug')('deployer-redeploytask')  
  , Q       = require('q')  
  , _       = require('underscore')
  , request = require('request')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap);


function RedeployTask(params) {
  this.status = 'Pending';
  this.project_id = params.project_id;
  this.configuration_id = params.configuration_id;
  this.branch = params.branch;
}


module.exports = RedeployTask;


RedeployTask.prototype.start = function start() {
  var project_id = this.project_id
    , configuration_id = this.configuration_id
    , branch = this.branch
    , scope;

  this.scope = scope = {
    template: null,
    oldEnv: null,
    detachIps: null,
    attachIps: null,
    newEnv: null,
  };

  // find the newest template
  return Q.fcall(function() {
    debug('redeploy: finding newest template');

    return skytap.projects.templates({ project_id: project_id })  
    .then(function(templates) {      
      scope.template = _.max(templates, function(template) {
        return template.id;
      });  
      debug('redeploy: found newest template %s', scope.template.id);
    })    
  })  

  // retrieve the old environment 
  .then(function() {      
    debug('redeploy: finding the environment');

    return skytap.environments.get({ configuration_id: configuration_id })
    .then(function(oldEnv) {
      debug('redeploy: old environment %s', oldEnv.id);
      scope.oldEnv = oldEnv;
    });  
  })

  // rename the old environment
  .then(function() {      
    debug('redeploy: renaming old environment');

    return skytap.environments.update({ configuration_id: scope.oldEnv.id, name: scope.oldEnv.name + ' - DECOMMISIONING' })    
    .then(function(oldEnv) {
      debug('redeploy: renamed old environment to %s', oldEnv.name);
      scope.oldEnv = oldEnv;
    });
  })

  // stop the old environment
  .then(function() {
    debug('redeploy: suspending old environment');

    return skytap.environments.suspend({ configuration_id: scope.oldEnv.id })
    .then(function() {
      debug('redeploy: waitigin for suspended state');
      return skytap.environments.waitForState({ configuration_id: scope.oldEnv.id, runstate: 'suspended' });
    })
    .then(function(oldEnv) {
      debug('redeploy: old environment suspended')
      scope.oldEnv = oldEnv;
    });
  })

  // detach public ip addresses
  .then(function() {
    debug('redeploy: detaching public ip addresses');

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
        debug('redeploy: detaching: %j', detachIp);
        return skytap.ips.detach(detachIp);
      }        
      return null;          
    }))
    .then(function() {
      debug('redeploy: all public ips detached');
    });    
  })

  // create the new environment
  .then(function() {      
    debug('redeploy: creating new environment');
    return skytap.environments.create({ template_id: scope.template.id })
    .then(function(newEnv) {
      debug('redeploy: new environment created %s', newEnv.id);
      scope.newEnv = newEnv;
    });
  })


  // add new environment to project
  .then(function() {      
    debug('redeploy: adding environment to project %s', project_id);
    return skytap.projects.addEnvironment({ 
      project_id: project_id,
      configuration_id: scope.newEnv.id    
    })
    .then(function() {
      debug('redeploy: added environment to project');
    });
  })  

  // start environemnt
  .then(function() {
    debug('redeploy: start new envionrment');

    return skytap.environments.update({
      configuration_id: scope.newEnv.id,
      runstate: 'running'
    })
    .then(function(environment) {
      debug('redeploy: waiting for running state');

      return skytap.environments.waitForState({
        configuration_id: environment.id,
        runstate: 'running'
      });
    })
    .then(function(environment) {
      debug('redeploy: new environment has been started')
      scope.newEnv = environment;
    });
  })


  // start installation
  .then(function() {
    debug('redeploy: start installation')
              
    var vm = scope.newEnv.vms[0]
      , ip_address = vm.interfaces[0].nat_addresses.vpn_nat_addresses[0].ip_address
      , installUrl = 'http://' + ip_address + ':8080/api/installer'
      , statusUrl  = 'http://' + ip_address + ':8080/api/status';

    console.log(installUrl);
    console.log(statusUrl);
    return Q.fcall(function() {
      debug('redeploy: wait for install service');

      var deferred = Q.defer();
      var poll = function() {
        request(statusUrl, function(err, response, body) {
          if(err || response.statusCode !== 200) {
            debug('redeploy: wait for install service');
            setTimeout(poll, 15000);
          } else {
            deferred.resolve(body);
          }
        });
      }
      poll();
      return deferred.promise;
    })
        
    // start installation
    .then(function() {
      debug('redeploy: installing');
      var deferred = Q.defer()

      request(installUrl, function(error, response, body) {
        if(!error && response.statusCode === 200) {            
          deferred.resolve(ip_address);
        } else {            
          deferred.reject(response);
        }
      });

      return deferred.promise;
    })

    // wait for installation to complete  
    .then(function() {
      debug('redeploy: wait for installation');

      var deferred = Q.defer();
      var poll = function() {        
        
        request(statusUrl, function(err, response, body) {          
          if(!err && response.statusCode === 200) {

            // add logic for checking status
            if(true) {
              deferred.resolve();
            } 

            // if not in completed status continue polling
            else {
              debug('redeploy: wait for installation');
              setTimeout(poll, 15000);
            }

          } else {
            deferred.reject({ err: err, response: response, body: body });
          }
        });        
      }

      poll();
      return deferred.promise;
    })

    // signal completion for installation
    .then(function() {
      debug('redeploy: installations complete');
    });
  })


  // attach public ip addresses
  .then(function() {
    debug('redeploy: attach public ip addresses');

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
        debug('redeploy: attaching: %j', attachIp);
        return skytap.ips.attach(attachIp);
      }
      return null;
    }))  
    .then(function() {
      debug('redeploy: all public ips attached');
    });
  })

  // remove vpn connection
  .then(function() {
    debug('redeploy: removing vpn connection');
  });
}