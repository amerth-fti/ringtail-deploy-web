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
    debug('startRedeploy: finding newest template');

    return skytap.projects.templates({ project_id: project_id })  
    .then(function(templates) {      
      scope.template = _.max(templates, function(template) {
        return template.id;
      });  
      debug('startRedeploy: found newest template %s', scope.template.id);
    })    
  })  

  // retrieve the old environment 
  .then(function() {      
    debug('startRedeploy: finding the environment');

    return skytap.environments.get({ configuration_id: configuration_id })
    .then(function(oldEnv) {
      debug('startRedeploy: old environment %s', oldEnv.id);
      scope.oldEnv = oldEnv;
    });  
  })

  // rename the old environment
  .then(function() {      
    debug('startRedeploy: renaming old environment');

    return skytap.environments.update({ configuration_id: scope.oldEnv.id, name: scope.oldEnv.name + ' - DECOMMISIONING' })    
    .then(function(oldEnv) {
      debug('startRedeploy: renamed old environment to %s', oldEnv.name);
      scope.oldEnv = oldEnv;
    });
  })

  // stop the old environment
  .then(function() {
    debug('stopRedeploy: stopping old environment');

    return skytap.environment.stop({ configuration_id: scope.oldEnv.id })
    .then(function() {
      return skytap.environment.waitForState({ configuration_id: scope.oldEnv.id, runstate: 'stopped' });
    })
    .then(function(oldEnv) {
      debug('stopRedeploy: old environment stopped')
      scope.oldEnv = oldEnv;
    });
  })

  // detach public ip addresses
  .then(function() {
    debug('startRedeploy: detaching public ip addresses');

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
        debug('startRedeploy: detaching: %j', detachIp);
        return skytap.ips.detach(detachIp);
      }        
      return null;          
    }))
    .then(function() {
      debug('startRedeploy: all public ips detached');
    });    
  })

  // create the new environment
  .then(function() {      
    debug('startRedeploy: creating new environment');
    return skytap.environments.create({ template_id: scope.template.id })
    .then(function(newEnv) {
      debug('startRedeploy: new environment created %s', newEnv.id);
      scope.newEnv = newEnv;
    });
  })


  // add new environment to project
  .then(function() {      
    debug('startRedeploy: adding environment to project %s', project_id);
    return skytap.projects.addEnvironment({ 
      project_id: project_id,
      configuration_id: scope.newEnv.id    
    })
    .then(function() {
      debug('startRedeploy: added environment to project');
    });
  })  

  // start environemnt
  .then(function() {
    debug('startRedeploy: start new envionrment');

    return skytap.environments.update({
      configuration_id: scope.newEnv.id,
      runstate: 'running'
    })
    .then(function(environment) {
      debug('startRedeploy: waiting for run state');

      return skytap.environments.waitForState({
        configuration_id: environment.id,
        runstate: 'running'
      });
    })
    .then(function(environment) {
      debug('startRedeploy: new environment has been started')
      scope.newEnv = environment;
    });
  })

  // start installation
  .then(function() {
    debug('startRedeploy: start installation')



  })

  // attach public ip addresses
  .then(function() {
    debug('startRedeploy: attach public ip addresses');

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
        debug('startRedeploy: attaching: %j', attachIp);
        return skytap.ips.attach(attachIp);
      }
      return null;
    }))  
    .then(function() {
      debug('startRedeploy: all public ips attached');
    });
  })

  // remove vpn connection
  .then(function() {
    debug('startRedeploy: removing vpn connection');
  });
}