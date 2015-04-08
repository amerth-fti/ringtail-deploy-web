var _       = require('underscore')
  , Q       = require('q')
  ;

/**
 * Browser them returns a static array
 * This browser can be used to implement other browser
 * and acts as the primary interface for browsers
 */
function StaticBrowser(config) {
  _.extend(this, config);
}

module.exports = StaticBrowser;


/**
 * Retrieves the list of branches as an array of strings
 *
 * @param {function} [next] - node callback
 * @return {promise}
 */
StaticBrowser.prototype.branches = function branches(next) {
  var data = this.staticBranches
    .split('\n')
    .map(function(val) {
      return val.trim();
    })
    .filter(function(val) {
      return val.length > 0;
    });      
  return new Q(data).nodeify(next);
};


/**
 * Retrieves the list of builds for a branch as a list of strings
 *
 * @param {string} branch - the branch to retrieve builds for
 * @param {function} [next] - node callback
 * @return {promise}
 */
StaticBrowser.prototype.builds = function builds(branch, next) {
  return new Q([]).nodeify(next);
};