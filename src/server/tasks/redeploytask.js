var ndebug   = require('debug')('deployer-redeploytask')  
  , util    = require('util')
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
  this.runlog = [];
}


module.exports = RedeployTask;


RedeployTask.prototype.start = function start() {
  var project_id = this.project_id
    , configuration_id = this.configuration_id
    , branch = this.branch    
    , scope
    , debug
    , self = this;

  this.scope = scope = {
    template: null,
    oldEnv: null,
    newEnv: null,
    detachIps: null,
    attachIps: null,
    user_data: null
  };

  debug = function() {
    ndebug.apply(this, arguments);
    self.runlog.push({ date: new Date(), value: util.format.apply(this, arguments) });
  };

  // find the newest template
  return Q.fcall(function() {
    debug('finding newest template');

    return skytap.projects.templates({ project_id: project_id })  
    .then(function(templates) {      
      scope.template = _.max(templates, function(template) {
        return template.id;
      });  
      debug('found newest template %s', scope.template.id);
    })    
  })  

  // retrieve the old environment 
  .then(function() {      
    debug('finding old environment');

    return skytap.environments.get({ configuration_id: configuration_id })
    .then(function(oldEnv) {
      debug('environment %s found', oldEnv.id);
      scope.oldEnv = oldEnv;      
    })
    .then(function() {     
      debug('finding old environment user_data'); 
      return skytap.environments.userdata({ configuration_id: configuration_id })
      .then(function(user_data) {        
        if(!user_data) {
          throw new Error('Environment must have user_data configured');
        }
        scope.user_data = user_data;        
      });
    })
  })

  // update status on old environment
  .then(function() {      
    debug('update status of old environment');  

    var oldEnv = scope.oldEnv
      , json = JSON.parse(scope.user_data.contents)
      , opts;

    json.status = 'redeploying';

    opts = { 
      configuration_id: oldEnv.id,
      contents:  JSON.stringify(json, null, 2)
    };

    return skytap.environments.updateUserdata(opts)
    .then(function(user_data) {
      debug('updated status on old environment');        
      scope.user_data = user_data;      
    });    
  })

  // stop the old environment
  .then(function() {
    debug('suspending old environment');

    return skytap.environments.suspend({ configuration_id: scope.oldEnv.id })
    .then(function() {
      debug('waiting for suspended state');
      return skytap.environments.waitForState({ configuration_id: scope.oldEnv.id, runstate: 'suspended' });
    })
    .then(function(oldEnv) {
      debug('old environment suspended')
      scope.oldEnv = oldEnv;
    });
  })

  // detach public ip addresses
  .then(function() {
    debug('detaching public ip addresses');

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
        debug('detaching: %j', detachIp);
        return skytap.ips.detach(detachIp);
      }        
      return null;          
    }))
    .then(function() {
      debug('all public ips detached');
    });    
  })

  // create the new environment
  .then(function() {      
    debug('creating new environment');    
    return skytap.environments.create({ template_id: scope.template.id })    
    .then(function(newEnv) {
      debug('new environment created %s', newEnv.id);
      scope.newEnv = newEnv;
    })
    .then(function() {
      debug('updating new environment details');
      var configuration_id = scope.newEnv.id
        , name = scope.oldEnv.name
        , description = scope.oldEnv.description;

      return skytap.environments.update({
        configuration_id: configuration_id,
        name: name, 
        description: description
      });
    })
    .then(function() {
      debug('setting new environment user_data');

try
{
      var newEnv = scope.newEnv
        , user_data = scope.user_data
        , json = JSON.parse(user_data.contents)
        , opts;

      json.status = 'deploying';

      var opts = {
        configuration_id: newEnv.id,
        contents: JSON.stringify(json, null, 2)
      };
      
      return skytap.environments.updateUserdata(opts)
      .then(function(user_data) {
        debug('new environment user_data configured')
        scope.user_data = user_data;        
      })
}
catch (ex) {
  console.log(ex);
}

    });
  })


  // add new environment to project
  .then(function() {      
    debug('adding environment to project %s', project_id);
    return skytap.projects.addEnvironment({ 
      project_id: project_id,
      configuration_id: scope.newEnv.id    
    })
    .then(function() {
      debug('added environment to project');
    });
  })  

  // start environemnt
  .then(function() {
    debug('start new envionrment');

    return skytap.environments.update({
      configuration_id: scope.newEnv.id,
      runstate: 'running'
    })
    .then(function(environment) {
      debug('waiting for running state');

      return skytap.environments.waitForState({
        configuration_id: environment.id,
        runstate: 'running'
      });
    })
    .then(function(environment) {
      debug('new environment has been started')
      scope.newEnv = environment;
    });
  })


  // perform installation
  .then(function() {
    debug('start installation')
              
    var vm = scope.newEnv.vms[0]
      , ip_address = vm.interfaces[0].nat_addresses.vpn_nat_addresses[0].ip_address
      , installUrl = 'http://' + ip_address + ':8080/api/installer'
      , statusUrl  = 'http://' + ip_address + ':8080/api/status'
      , updateUrl  = 'http://' + ip_address + ':8080/api/UpdateInstallerService'
      , configUrl  = 'http://' + ip_address + ':8080/api/config';

    debug('%s', installUrl);
    debug('%s', statusUrl);
    debug('%s', updateUrl);
    debug('%s', configUrl);

    return Q.fcall(function() {
      debug('waiting for install service');

      var deferred = Q.defer();
      var poll = function() {  
        setTimeout(function() {
          request(statusUrl, function(err, response, body) {
            if(err || response.statusCode !== 200) {
              poll();              
            } else {
              deferred.resolve(body);
            }
          });
        }, 5000);
      }
      poll();
      return deferred.promise;
    })

    // upgrade install service
    .then(function() {
      debug('update install service');
      
      return Q.fcall(function() {

        // fire off update
        var deferred = Q.defer();
        request(updateUrl, function() {
          deferred.resolve();
        });
        return deferred.promise;

      })
      .then(function() {
        debug('waiting for install service to update');
        // wait for upgrade to complete
        var deferred = Q.defer();
        var poll = function() {
          setTimeout(function() {
            request(statusUrl, function(err, response, body) {
              if(err || response.statusCode !== 200) {                
                poll();
              } else {
                deferred.resolve(body);
              }
            });
          }, 5000);
        }
        poll();
        return deferred.promise;

      });
    })

    // configure install service
    .then(function() {
      debug('configure install service');

      var config = scope.user_data
        , keys = _.keys(config.installer);

      // update the branch config
      return Q.fcall(function() {        
        var deferred = new Q.defer();
        
        request(configUrl + '?key=Common|BRANCH_NAME&value=' + branch, function(err) {
          if(err) deferred.reject(err);
          else deferred.resolve();
        })

        return deferred.promise;  
      })

      // update all configures
      .then(function() {
        
        // create functions to execute config
        var funcs = keys.map(function(key) {
          return function() {
            var deferred = new Q.defer()
              , value = config.installer[key]
              , url;
            
            url = configUrl + '?key=' + key + '&value=' + value;
            debug('configuring %s', url);
            request(url, function(err) {
              if(err) deferred.reject(err);
              else deferred.resolve();
            })

            return deferred.promise;  
          };
        });

        return funcs.reduce(Q.when, Q(0));
      });
    })
        
    // start installation
    .then(function() {
      debug('starting installation');

      // fire off the install    
      request(installUrl);  
    })

    // wait for installation to complete  
    .then(function() {
      debug('waiting for install to complete');

      var deferred = Q.defer();
      var poll = function() {        
        setTimeout(function() {
          request(statusUrl, function(err, response, body) {          
            if(!err && response.statusCode === 200) {

              // add logic for checking status
              if(body.indexOf('UPGRADE COMPLETE') >= 0) {
                deferred.resolve();
              } 

              // if not in completed status continue polling
              else {              
                poll();
              }

            } else {
                poll();
            }
          });
        }, 15000);
      };
      poll();      
      return deferred.promise;
    })

    // signal completion for installation
    .then(function() {
      debug('installations complete');
    });
  })


  // attach public ip addresses
  .then(function() {
    debug('attach public ip addresses');

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
        debug('attaching: %j', attachIp);
        return skytap.ips.attach(attachIp);
      }
      return null;
    }))  
    .then(function() {
      debug('all public ips attached');
    });
  })

  // // remove vpn connection
  .then(function() {
    debug('attempting to remove vpn connection');

    var env = scope.newEnv
      , network = env.networks[0]
      , attachment = network.vpn_attachments[0]
      , vpn = attachment ? attachment.vpn : null
      , opts
      , deferred = Q.defer();

    if(vpn) {
      debug('removing vpn %s', vpn.id);
      
      opts = {
        configuration_id: env.id,
        network_id: network.id,
        vpn_id: vpn.id
      };

      var poll = function() {        
        setTimeout(function() {
          skytap.vpns.detach(opts, function(err) {
            if(err) {
              debug('error detaching vpn: %j, will retry shortly', err);
              poll();
            } 
            else {
              debug('vpn successfully detached');
              deferred.resolve();
            }
          })
        }, 15000);
      };

      poll();
      return deferred.promise;        
    }
  })

  // saving config data
  .then(function() {
    debug('updating status of new environment');

    var newEnv = scope.newEnv
      , user_data = scope.user_data
      , json = JSON.parse(user_data.contents)
      , opts;

    json.status = 'deployed'
    opts = {
      configuration_id: newEnv.id, 
      contents: JSON.stringify(json, null, 2) 
    };

    return skytap.environments.updateUserdata(opts)
    .then(function(user_data){
      scope.user_data = user_data;      
    })    
  })

  // kill old environment
  .then(function() {
    debug('deleting old environment');

    var oldEnv = scope.oldEnv
      , user_data = scope.user_data
      , json = JSON.parse(user_data.contents);

    json.status = 'deleted';
    opts = {
      configuration_id: oldEnv.id,
      contents: JSON.stringify(json, null, 2)
    };

    return skytap.environments.updateUserdata(opts)    
  })

  .then(function() {
    debug('environment deployed complete!');
  });
}