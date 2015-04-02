var url       = require('url')
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
    , opts = {
        uri: this.httpBranchesUri,
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
    , uri = this.httpBuildsUri.replace(':branch', branch)
    , opts = {
        uri: uri,
        json: true
      };    
  request.get(opts, function(err, response, body) {
    if(err) deferred.reject(err);
    else {    
      var results = body.map(function(val) {
        var parts = val.split('/');
        return parts[parts.length - 1];
      });
      deferred.resolve(results);
    }
  });
  return deferred.promise.nodeify(next);
};