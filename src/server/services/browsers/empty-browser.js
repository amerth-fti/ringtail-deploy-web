var _       = require('underscore')
  , Q       = require('q')
  ;

/**
 * Browser them returns empty arrays
 * This browser can be used to implement other browser
 * and acts as the primary interface for browsers
 */
function EmptyBrowser(config) {
  _.extend(this, config);
}

module.exports = EmptyBrowser;


/**
 * Retrieves the list of branches as an array of strings
 *
 * @param {function} [next] - node callback
 * @return {promise}
 */
EmptyBrowser.prototype.branches = function branches(next) {
  return new Q([]).nodeify(next);
};


/**
 * Retrieves the list of builds for a branch as a list of strings
 *
 * @param {string} branch - the branch to retrieve builds for
 * @param {function} [next] - node callback
 * @return {promise}
 */
EmptyBrowser.prototype.builds = function builds(branch, next) {
  return new Q([]).nodeify(next);
};