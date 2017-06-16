var util    = require('util')
  , debug   = require('debug')('deployer-3-install-machine')
  , Q       = require('q')
  , _       = require('underscore')
  , request = require('request')
  , Task    = require('./task')
  , machineSvc = require('../services/machine-service')
  , configSvc  = require('../services/config-service')
  , sysConfig  = require('../../../config')
  , RingtailClient = require('ringtail-deploy-client')
  ;


function TaskImpl(options) {
  this.name = 'Install Ringtail';
  this.pollInterval = 15000;
  this.installInterval = 60000;
  Task.call(this, options);

  this.validators.required.push('branch');
  this.serviceClient = null;  // used by unit test to capture the client

  this.execute = async function execute(scope, log) {

    var options         = scope.options
      , machineId       = this.machineId
      , configId        = this.configId
      , pollInterval    = this.pollInterval
      , installInterval = this.installInterval
      , branch          = this.getData(scope, 'branch')
      , me = this
      ;

    if(branch === undefined) {
      log('alert|Incomplete data - no branch was selected.');
      return;
    }

    let error = '';
    let machine = await machineSvc.get(machineId);
    let serviceIP = machine.intIP;
    let config = await configSvc.get(configId);
    let client = me.serviceClient = new RingtailClient({ serviceHost: serviceIP });
    let machineIdentity = machine.machineName + ' ' + machine.intIP ;

    log('start|' + machineIdentity + ' starting validation');

    // check if the service is available.
    log('start|Checking to see if the service is responsive ' + client.statusUrl);
    try{
      await client.waitForServiceLimited(20 * 1000);
    } catch(e) {
      let str = machineIdentity + ' is offline or service unreachable. Try starting your machine, or if it is already started, log onto this machine and make sure the service RingtailDeployService is running.';
      log('alert|' + str);
      return { message: str};
    }
    log('end|The service is responding on ' + machineIdentity);

    // check to see if a job is already in progress.
    log('start|Checking to see if a job is already running ' + client.statusUrl);
    try{
      let isRunning = await client.isJobRunning();
      if (isRunning) {
        throw new IsRunningError(machineIdentity + " is already running a job. Try again in a few minutes.");
        //let str = machineIdentity + ' is already running a job. Try again in a few minutes.';
        //log('alert|' + str);
        //return { message: str};
      }
    } catch(e) {
      console.log(e);
      log('error', e.name + " " + e.message);
      let str = machineIdentity + ' is having a problem checking whether or not a job is already running.';
      log('alert|' + str);
      return { message: str};
    }
    log('end|A job is already running on ' + machineIdentity);

    // make sure we can set the self-update location.
    if(this.region && this.region.serviceConfig && this.region.serviceConfig.updatePath) {
      // point the installer service to the desired regional path.
      let path = this.region.serviceConfig.updatePath;
      log('start|' + machineIdentity + ' is setting the install update location to ' + path);
      try{
        await client.setUpdatePath(path);
      } catch(e) {
        let str = machineIdentity + ' is having a problem with setting the self-update path.  The service is online, but it may have a permissions problem.  Check C:/Upgrade/InstallService/config.config credentials.';
        log('alert|' + str);
        return { message: str};
      }
    }

    // self-update the install service.
    log('start|' + machineIdentity + ' is updating install service to latest version.');
    try{
      await client.update();
    } catch(e) {
      let str = machineIdentity + ' is having a problem self-updating.  The service is online, but it may have a permissions problem.  Check C:/Upgrade/InstallService/config.config credentials.';
      log('alert|' + str);
      return { message: str};
    }

    // wait for the self-update to complete.
    log('start|' + machineIdentity + ' is waiting for the service update to complete');
    try{
      await client.waitForServiceLimited();
    } catch(e) {
      let str = machineIdentity + ' is having a problem self-updating the deployment service.  The service was online, and the update started, but its not responding anymore.';
      log('alert|' + str + ' err details: %j', e);
      return { message: str};
    }

    log('end|The service self-update looks good on ' + machineIdentity);

    // configure install service
    debug('configuring install service' + machineId);
    let configs = {
      'Common|BRANCH_NAME' : branch,
      'RoleResolver|ROLE' : config.roles[0]
    };

    //kind of a bit hacky, but handles quoting to server
    let configData = config.data;
    let configKeys = Object.keys(configData);
    configKeys.forEach(function(key){
      let tempkey = configData[key] || '';
      //uninstall exclusions should not be escape quoted
      if(tempkey && tempkey.replace && key.indexOf('UNINSTALL_EXCLUSIONS') < 0) {
        tempkey = tempkey.replace(/\"/g, '').trim();
        if(tempkey.indexOf(' ') > 0) {
          configData[key] = '"""' + tempkey + '"""';
        }
      }
    });
    _.extend(configs, configData);

    if(config.launchKey) {
      _.extend(configs, config.launchKey);
    }
    _.extend(configs, getConfigsFromOptions(options));

    configs['Common|BRANCH_NAME'] = branch;

    log('start|Checking that we can send configuration to ' + machineIdentity);
    try{
      await client.setConfigs(configs);

    } catch(e) {
      let str = machineIdentity + ' is having a problem accepting configurations.  This is unexpected, please contact a system administrator to investigate.';  // i dont' know why this would fail, since the site is known to be up at this point.
      log('alert|' + str + ' err details: %j', e);
      return { message: str};
    }  

    log('end|Sending deployment configuration succeeded on ' + machineIdentity);
      
    log('start|Checking to see if the machine is healthy ' + machineIdentity);
    let prereqs = {};
    try{
      prereqs = await client.prerequisites();
    } catch (e) {
        let str = 'Machine Health Check: ' + machineIdentity + ' had an unknown failure with the machine health checks.  This is unexpected, please contact a system administrator to investigate.';  // i dont' know why this would fail, since the site is known to be up at this point.
        log('alert|' + str + ' err details: %j', e);
        return { message: str};            
    }

    try{
      prereqs = JSON.parse(prereqs);
    } catch(e) {
        let str = 'Machine Health Check: ' + machineIdentity + ' had an unknown failure with the machine health checks.  This is unexpected, please contact a system administrator to investigate.';  // i dont' know why this would fail, since the site is known to be up at this point.
        log('alert|' + str + ' err details: %j', e);
    }

    try {
      if(prereqs && !prereqs.success) {
        if(prereqs.errors && prereqs.errors.length) {
          _.each(prereqs.errors, function(error) {
            let str = 'Machine Health Check: ' + machineIdentity;
            log('alert|' + str + ' ' + error.description);
          });
          return { message: prereqs.errors};
        }
      }
    } catch(e) {
        let str = 'Machine Health Check: ' + machineIdentity + ' had an unknown failure reading the response from the machine health checks.  This is unexpected, please contact a system administrator to investigate.';  // i dont' know why this would fail, since the site is known to be up at this point.
        log('alert|' + str + ' err details: %j', e);
        return { message: str};      
    }

    log('end|Machine Health Check is ok on ' + machineIdentity);

    log('start|Running installation package validation on ' + machineIdentity);
    try{
      await client.validate();
    } catch(e) {
      let str = machineIdentity + ' had a problem initiating validations.  This is unexpected, please contact a system administrator to investigate.';  // i dont' know why this would fail, since the site is known to be up at this point.'
      log('alert|' + str);
      return { message: str};
    }    
   
    // wait for Validate to complete
    log('start|Waiting for installation package validations to complete on ' + machineIdentity);
    let retry = false;
    try {
      await client.waitForValidate(function(status) {
        me.rundetails = status;
      });
    } catch (e) {
      let str = machineIdentity + ' listed a failure with deployment-run validations.';
      log('info|' + str + ' error details: %j', e);
    }

    try {
      log('start|Reading validation response from ' + machineIdentity);
      let messages = parseInstallDiagnostic(me.rundetails);

      _.each(messages, function(message) {
        let str = machineIdentity + ' ' + message;
        log('alert|' + str);
      });

      if(messages.length > 0) {
        return { message: 'validations failed'};
      }
    } catch (e) {
      let str = machineIdentity + ' had an error parsing the diagnostic details. This is unexpected, please contact a system administrator to investigate.';  // i dont' know why this would fail, since the site is known to be up at this point.
      log('alert|' + str + ' error details: %j', e);
      return { message: str};
    }

    // signal completion for installation
    log('end|All validations passed - ' + machineIdentity);
  };

  function parseInstallDiagnostic(status) {
    let messages = [];
    let runDetailLines = status.split('<p>');
    let keys = [
      'could not find a build for:',
      'error:'
    ];    
    _.each(runDetailLines, function(line) {
      _.each(keys, function(key) {
        let idx = line.toLowerCase().indexOf(key);
        if(idx >= 0) {
          messages.push(helpMessageConstruct(key, line));
        }
      });
    });
    return messages;
  }

  function helpMessageConstruct(key, line) {
    line = line.split('</p>')[0];
    if(key === 'could not find a build for:') {
      try {
        let message = line.split('-');
        if(message.length > 1) {
          let str = 'The installation folder you picked is missing ' 
            + message[1] + ' which is a required installer. '
            + ' .  You can choose another installer location, or fix ' 
            + message[0].split(':')[1] + ' location.';
          return str;
        }
      } catch (e) {
        return line;
      }
    } else {
      // extend friendly messages here for now....  this is pretty crude, but an ok starting point and can be refactored later..
      return line;
    }
  }

  function extractLogInfoOnWarning(rundetails) {
    let runDetailSplit = rundetails.split('<p>');
    let messages = [];
    _.each(runDetailSplit, function(partialRunDetail) {
      let idx = partialRunDetail.indexOf('UPGRADE WARNING');
      if(idx >= 0) {
        let split = partialRunDetail.split('</p>')[0];
        if(split.length > 0) {
          messages.push(split);
        }
      }
    });

    debug('exiting extractLogInfoOnWarning');
    return messages;
  }

  function isTaskEnded(rundetails) {
    let failed = rundetails.indexOf('UPGRADE FAILED') >= 0 || rundetails.indexOf('UPGRADE ABORTED') >= 0,
      successful = rundetails.indexOf('UPGRADE SUCCESSFUL') >= 0,
      retry = rundetails.indexOf('UPGRADE RETRY') >= 0;

    return (retry || failed) && !successful;
  }

  function isTaskWarning(rundetails) {
    let warn = rundetails ? rundetails.indexOf('UPGRADE WARNING') >= 0 : false;

    return warn;
  }

  /**
   * Converts UI logic into additional options
   * Could be refactred into client as a method call
   * to help configure the service
   */
  function getConfigsFromOptions(opts) {
    var result = {};
    if(opts) {
      if(opts.wipeRpfWorkers) {
        result['Common|FILE_DELETIONS'] = 'C:\\Program Files\\FTI Technology\\Ringtail Processing Framework\\RPF_Supervisor';
      } else {
        result['Common|FILE_DELETIONS'] = '';
      }
    }
    return result;
  }  
}



util.inherits(TaskImpl, Task);

module.exports = TaskImpl;