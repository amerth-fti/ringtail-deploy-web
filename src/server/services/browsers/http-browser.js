var url       = require('url')
  , path      = require('path')
  ,  request  = require('request')  
  , Q         = require('q')
  , _         = require('underscore')
  ;

function HttpBrowser(config) {
  _.extend(this, config);
}

module.exports = HttpBrowser;


/**
 * Retrieves the list of branches as an array of strings
 *
 * @param {function} [next] - node callback
 * @return {promise}
 */
HttpBrowser.prototype.branches = function branches(next) {
  var deferred = Q.defer()
    , urlObj = {      
        protocol: 'http',
        host: this.httpHost,
        pathname: '/Api/V1/Directory'
      }
    , opts = {
        uri: url.format(urlObj),        
        json: true
      };   
  request.get(opts, function(err, response, body) {
    if(err) deferred.reject(err);      
    else    deferred.resolve(body);
  });
  return deferred.promise.nodeify(next);
};


/**
 * Retrieves the list of builds for a branch as a list of strings
 *
 * @param {string} branch - the branch to retrieve builds for
 * @param {function} [next] - node callback
 * @return {promise}
 */
HttpBrowser.prototype.builds = function builds(branch, next) {
  var deferred = Q.defer()
    , urlObj = {
        protocol: 'http',
        host: this.httpHost,
        pathname: '/Api/V1/Directory',
        query: { 'path': branch }        
      }
    , opts = {
        uri: url.format(urlObj),
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