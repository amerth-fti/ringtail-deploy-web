var util    = require('util')
  , Q       = require('q')
  , _       = require('underscore')
  , request = require('request')
  , Task    = require('./task')
  , machineSvc = require('../services/machine-service')
  , configSvc  = require('../services/config-service')
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

    log('starting deployment');

    // Load the machine
    log('loading machine ' + machineId);
    let machine = await machineSvc.get(machineId);
    let serviceIP = machine.intIP;

    // load the config for the machine
    log('loading config ' + configId);
    let config = await configSvc.get(configId);

    // Create the Ringtail Install Service client
    let client = me.serviceClient = new RingtailClient({ serviceHost: serviceIP });
    //log('will use: %s', client.installUrl);
    log('will use: %s', client.statusUrl);
    // log('will use: %s', client.updateUrl);
    // log('will use: %s', client.configUrl);
    // log('will use: %s', client.installedUrl);

    // wait for the service to be available
    log('waiting for service to start');
    await client.waitForService();

    // // upgrade install service
    // log('updating install service to latest version');
    // await client.update();

    // // wait for service to return
    // log('waiting for service to return');
    // await client.waitForService();

    // // configure install service
    // log('configuring install service');
    // let configs = {
    //   'Common|BRANCH_NAME' : branch,
    //   'RoleResolver|ROLE' : config.roles[0],
    //   'JobLogger|ENV_NAME': machine.machineName,
    //   'JobLogger|JOB_ID': me.jobId
    // };

    // //kind of a bit hacky, but handles quoting to server
    // let configData = config.data;
    // let configKeys = Object.keys(configData);
    // configKeys.forEach(function(key){
    //   let tempkey = configData[key] || '';
    //   if(tempkey && tempkey.replace) {
    //     tempkey = tempkey.replace(/\"/g, '').trim();
    //     if(tempkey.indexOf(' ') > 0) {
    //       configData[key] = '"""' + tempkey + '"""';
    //     }
    //   }
    // });
    // _.extend(configs, configData);

    // if(config.launchKey) {
    //  _.extend(configs, config.launchKey);
    // }
    // _.extend(configs, getConfigsFromOptions(options));

    // log('sending config object');
    // await client.setConfigs(configs);

    // start installation
    //log('starting installation');
    await client.install();

    // wait for installation to complete
    log('waiting for install to complete, refer to Run Details');
    let retry = false;
    await client.waitForInstall(function(status) {
      me.rundetails = status;
      retry = status.indexOf('UPGRADE RETRY') >= 0 && status.indexOf('UPGRADE SUCCESSFUL') === -1 && status.indexOf('UPGRADE FAILURE') === -1;
    });

    let maxRetry = 10;
    let currentRetry = 1;

    while(retry && currentRetry <= maxRetry) {
      log('there was a task failre.  retrying from that step onwards.  ' + currentRetry + ' of ' + maxRetry);
      await client.retry();

      await client.waitForInstall(function(status) {
        me.rundetails = status;
      });

      retry = me.rundetails.indexOf('UPGRADE RETRY') >= 0 && me.rundetails.indexOf('UPGRADE SUCCESSFUL') === -1 && me.rundetails.indexOf('UPGRADE FAILURE') === -1;
      currentRetry++;        
    }

    if(retry && currentRetry >= maxRetry) {
      if(!(me.rundetails.indexOf('UPGRADE SUCCESSFUL') >= 0)) {
        throw new Error('ran out of retries');
      }
    }
  

    // update machine install notes
    log('retrieving install info for %s', serviceIP);
    machine.installNotes = await client.installed();
    await machineSvc.update(machine);

    // signal completion for installation
    log('installation complete');
  };
}

/**
 * Converts UI logic into additional options
 * Could be refactred into client as a method call
 * to help configure the service
 */
function getConfigsFromOptions(opts) {
  var result = {};
  if(opts) {
    if(opts.keepRpfwInstalls) {
      result['Common|UNINSTALL_EXCLUSIONS'] = 'Framework Workers';
    } else {
      result['Common|UNINSTALL_EXCLUSIONS'] = '';
    }

    if(opts.wipeRpfWorkers) {
      result['Common|FILE_DELETIONS'] = 'C:\\Program Files\\FTI Technology\\Ringtail Processing Framework\\RPF_Supervisor';
    } else {
      result['Common|FILE_DELETIONS'] = '';
    }
  }
  return result;
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;