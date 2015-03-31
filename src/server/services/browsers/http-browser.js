var request = require('request')
  , path    = require('path')
  , Q       = require('q')
  , _       = require('underscore')
  ;

function HttpBrowser(config) {
  _.extend(this, config);
}

module.exports = HttpBrowser;



HttpBrowser.prototype.branches = function branches(next) {
  var deferred = Q.defer()
    , opts = {
        uri: this.httpHost + '/Directory',
        json: true
      };
  request.get(opts, function(err, response, body) {
    if(err) deferred.reject(err);      
    else    deferred.resolve(body);
  });
  return deferred.promise.nodeify(next);
};



HttpBrowser.prototype.builds = function builds(branch, next) {
  var deferred = Q.defer()
    , opts = {
        uri: this.httpHost + '/Directory?path=' + branch,
        json: true
      };    
  request.get(opts, function(err, response, body) {
    if(err) deferred.reject(err);
    else {
      // results returned as:
      //   ["consolidation/20150319.2","consolidation/20150311.1","consolidation/20150319.1"]
      // lop off the prefix parts
      var results = body.map(function(val) {
        var parts = val.split('/');
        return parts.length === 2 ? parts[1] : parts[0];
      });
      deferred.resolve(results);
    }
  });
  return deferred.promise.nodeify(next);
};