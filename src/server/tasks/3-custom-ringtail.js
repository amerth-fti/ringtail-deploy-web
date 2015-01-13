var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , request = require('request')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task')
  , machineSvc = require('../services/machineService')
  ;


function TaskImpl(options) {  
  this.name = 'Install Ringtail';  
  Task.call(this, options);  

  this.execute = function execute(scope, log) {  
    
    var branch = this.getData(scope, 'branch')
      , config = this.getData(scope, 'config')
      , machine = this.getData(scope, 'machine')
      , serviceIP = machine.intIP
      ;


    return Q.fcall(function() {
      log('start installation');
                      
      var installUrl    = 'http://' + serviceIP + ':8080/api/installer'
        , statusUrl     = 'http://' + serviceIP + ':8080/api/status'
        , updateUrl     = 'http://' + serviceIP + ':8080/api/UpdateInstallerService'
        , configUrl     = 'http://' + serviceIP + ':8080/api/config'
        , installedUrl  = 'http://' + serviceIP + ':8080/api/installedBuilds'
        ;  

      log('will use: %s', installUrl);
      log('will use: %s', statusUrl);
      log('will use: %s', updateUrl);
      log('will use: %s', configUrl);
      log('will use: %s', installedUrl);

      return Q.fcall(function() {

        var deferred = Q.defer();
        var poll = function() {  
          log('waiting for install service');
          setTimeout(function() {          
            request({ url: statusUrl, timeout: 15000 }, function(err, response, body) {
              log('%j %j', err, response);
              if(err || response.statusCode !== 200) {              
                poll();              
              } else {
                deferred.resolve(body);
              }
            });
          }, 15000);
        };
        poll();
        return deferred.promise;
      })

      // upgrade install service
      .then(function() {
        log('update install service');
        
        return Q.fcall(function() {

          // fire off update
          var deferred = Q.defer();
          request(updateUrl, function() {
            deferred.resolve();
          });
          return deferred.promise;

        })
        .then(function() {        

          var deferred = Q.defer();
          var poll = function() {
            log('waiting for install service to update');
            setTimeout(function() {
              request({ url: statusUrl, timeout: 15000 }, function(err, response, body) {
                if(err || response.statusCode !== 200) {                
                  if(err) log(err);
                  poll();
                } else {
                  deferred.resolve(body);
                }
              });
            }, 15000);
          };
          poll();
          return deferred.promise;

        });
      })

      // configure install service
      .then(function() {
        log('configure install service');

        var keys = _.keys(config);

        // update the branch config
        return Q.fcall(function() {        
          var deferred = new Q.defer()
            , url;
          
          url = configUrl + '?key=Common|BRANCH_NAME&value=' + branch;
          log('configuring %s', url);
          request(url, function(err) {
            if(err) deferred.reject(err);
            else deferred.resolve();
          });

          return deferred.promise;  
        })

        // update all configures
        .then(function() {
          
          // create functions to execute config
          var funcs = keys.map(function(key) {
            return function() {
              var deferred = new Q.defer()
                , value = config[key]
                , url;
              
              url = configUrl + '?key=' + key + '&value=' + value;
              log('configuring %s', url);
              request(url, function(err) {
                if(err) deferred.reject(err);
                else deferred.resolve();
              });

              return deferred.promise;  
            };
          });

          /* jshint es5:false */
          /* jshint newcap:false */
          return funcs.reduce(Q.when, Q(0));        
        });
      })
          
      // start installation
      .then(function() {
        log('starting installation');

        // fire off the install    
        request(installUrl);  
      })

      // wait for installation to complete  
      .then(function() {
        
        var deferred = Q.defer();
        var poll = function() {        
          log('waiting for install to complete');
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
          }, 60000);
        };
        poll();      
        return deferred.promise;
      })

      // update machine install notes
      .then(function() {
        
        return Q.fcall(function() {
          log('retrieving install info for %s', serviceIP);
          var deferred = Q.defer();        
          request({ url: installedUrl, timeout: 15000 }, function(err, response, body) {
            if(err) log(err);

            if(err) deferred.reject(err);
            else deferred.resolve(body);              
          });      
          return deferred.promise;
        })

        .then(function(body) {
          log('found installed builds for %s', serviceIP);
          var result = body.replace(/"/g, '');
          result = result.replace(/<p\>/g, '');
          result = result.replace(/<\/p\>/g, '\n');
          result = result.split('\n');
          result.splice(result.length - 1); // remove empty string at end
          log(result);
          return result;
        })

        .then(function(data) {
          machine.installNotes = data;
          return machineSvc.update(machine);
        });

      })

      // signal completion for installation
      .then(function() {
        log('installations complete');
      });

    });

  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;    