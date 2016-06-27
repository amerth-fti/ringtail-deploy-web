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

  this.execute = function execute(scope, log) {

    var options         = scope.options
      , machineId       = this.machineId
      , configId        = this.configId
      , pollInterval    = this.pollInterval
      , installInterval = this.installInterval
      , branch          = this.getData(scope, 'branch')
      , machine
      , config
      , serviceIP
      , client
      , me = this
      ;

    return Q.fcall(function() {
      log('start installation');

      // Load the machine
      return Q.fcall(function() {
        log('loading machine ' + machineId);
        return machineSvc
          .get(machineId)
          .then(function(result) {
            machine   = result;
            serviceIP = result.intIP;
          });
      })

      // load the config for the machine
      .then(function() {
        log('loading config ' + configId);
        return configSvc
          .get(configId)
          .then(function(result) {
            config = result;
          });
      })

      // Create the Ringtail Install Service client
      .then(function() {
        client = me.serviceClient = new RingtailClient({ serviceHost: serviceIP });
        log('will use: %s', client.installUrl);
        log('will use: %s', client.statusUrl);
        log('will use: %s', client.updateUrl);
        log('will use: %s', client.configUrl);
        log('will use: %s', client.installedUrl);
      })

      // wait for the service to be available
      .then(function() {
        log('waiting for service to start');
        return client.waitForService();
      })

      // upgrade install service
      .then(function() {
        log('updating install service to latest version');
        return client.update();
      })

      // wait for service to return
      .then(function() {
        log('waiting for service to return');
        return client.waitForService();
      })

      // configure install service
      .then(function() {
        log('configuring install service');
        var configs = {
          'Common|BRANCH_NAME' : branch,
          'RoleResolver|ROLE' : config.roles[0],
          'JobLogger|ENV_NAME': machine.machineName,
          'JobLogger|JOB_ID': me.jobId
        };

        //kind of a bit hacky, but handles quoting to server
        var configData = config.data;
        var configKeys = Object.keys(configData);
        configKeys.forEach(function(key){
          var tempkey = configData[key] || '';
          if(tempkey && tempkey.replace) {
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

        log('sending config object %j', configs);
        //log('installation complete');
        return client.setConfigs(configs);
      })

      // start installation
      .then(function() {
        log('starting installation');
        return client.install();
      })

      // wait for installation to complete
      .then(function() {
        log('waiting for install to complete, refer to Run Details');
        return client.waitForInstall(function(status) {
          me.rundetails = status;
        });
      })

      // update machine install notes
      .then(function() {
        log('retrieving install info for %s', serviceIP);
        return client
          .installed()
          .then(function(builds) {
            machine.installNotes = builds;
            return machineSvc.update(machine);
          });
      })

      // signal completion for installation
      .then(function() {
        log('installation complete');
      });

    });

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