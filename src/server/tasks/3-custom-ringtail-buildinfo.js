var util    = require('util')  
  , Q       = require('Q')
  , _       = require('underscore')
  , request = require('request')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap)
  , Task    = require('./task')
  , machineSvc = require('../services/machineService');


function TaskImpl(options) {  
  this.name = 'Ringtail Info';  
  Task.call(this, options);

  this.execute = function execute(scope, log) {  
    var serviceIP = this.getData(scope, 'serviceIP')
      , machineId = this.getData(scope, 'machineId');

    return Q.fcall(function() {
      log('retrieving installed builds for %s', serviceIP);        

      var url  = 'http://' + serviceIP + ':8080/api/installedBuilds';  
      log('will use: %s', url);

      return Q.fcall(function() {
        var deferred = Q.defer();        
        request({ url: url, timeout: 15000 }, function(err, response, body) {
          log('%j %j', err, response);
          if(err) {              
            deferred.reject(err);
          } else {
            deferred.resolve(body);
          }
        });      
        return deferred.promise;
      });


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

    })

  };
}

util.inherits(TaskImpl, Task);

module.exports = TaskImpl;