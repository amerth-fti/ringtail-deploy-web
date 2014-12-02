var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , request = require('request')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task');


function TaskImpl(options) {  
  this.name = 'Install Ringtail';  
  Task.call(this, options);  

  this.execute = function execute(scope, log) {  
    
    return Q.fcall(function() {
      log('start installation')
                
      var branch = this.getData(scope, "branch")
        , environment = this.getData(scope, "env")
        , ip_address = this.getData(scope, "ip_address")
        , installUrl = 'http://' + ip_address + ':8080/api/installer'
        , statusUrl  = 'http://' + ip_address + ':8080/api/status'
        , updateUrl  = 'http://' + ip_address + ':8080/api/UpdateInstallerService'
        , configUrl  = 'http://' + ip_address + ':8080/api/config';

      log('will use: %s', installUrl);
      log('will use: %s', statusUrl);
      log('will use: %s', updateUrl);
      log('will use: %s', configUrl);

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
        }
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
          }
          poll();
          return deferred.promise;

        });
      })

      // configure install service
      .then(function() {
        log('configure install service');

        var user_data = scope.user_data
          , json = JSON.parse(user_data.contents)
          , keys = _.keys(json.installer);

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
                , value = json.installer[key]
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

      // signal completion for installation
      .then(function() {
        log('installations complete');
      });
    }) 
  }
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;    