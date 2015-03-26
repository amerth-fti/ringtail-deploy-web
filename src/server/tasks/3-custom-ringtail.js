var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , request = require('request')
  , Task    = require('./task')
  , machineSvc = require('../services/machine-service')
  , RingtailClient = require('ringtail-deploy-client')
  ;


function TaskImpl(options) {  
  this.name = 'Install Ringtail';  
  this.pollInterval = 15000;
  this.installInterval = 60000;
  Task.call(this, options);  

  this.validators.required.push('branch');
  this.validators.required.push('config');
  this.validators.required.push('machine');  
  this.serviceClient = null;

  this.execute = function execute(scope, log) {  
    
    var branch = this.getData(scope, 'branch')
      , config = this.getData(scope, 'config')
      , machine = this.getData(scope, 'machine')
      , serviceIP = machine.intIP
      , pollInterval = this.pollInterval
      , installInterval = this.installInterval
      , client
      , me = this
      ;

    client = this.serviceClient = new RingtailClient({ serviceHost: serviceIP });

    return Q.fcall(function() {
      log('start installation');      
      log('will use: %s', client.installUrl);
      log('will use: %s', client.statusUrl);
      log('will use: %s', client.updateUrl);
      log('will use: %s', client.configUrl);
      log('will use: %s', client.installedUrl);

      // wait for the service to be available
      return Q.fcall(function() {
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
        var opts = { 'Common|BRANCH_NAME' : branch };
        _.extend(opts, config);                    
        return client.setConfigs(opts);
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

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;    