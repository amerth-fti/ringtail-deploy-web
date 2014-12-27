var Q         = require('q')
  , skytap    = require('node-skytap')
  , EnvMapper = require('../mappers/envMapper')
  , envMapper
  ;

/** 
 * Gets the list of environments
 *
 * @api public
 * @param {Object} paging
 * @param {Function} next
 * @return {Promise} resolves to Array[Env]
 */
module.exports.list = function list(paging, next) {
  return envMapper
    .list(paging)
    .then(joinSkytap)
    .nodeify(next);
};

/**
 * Helper function to join skytap data
 * 
 * @api private
 * @param {Array[Env]} envs
 * @param {Function} next
 */
function joinSkytap(envs) {
  var lookup = {}
    , promises;

  promises = envs.map(function(env) {
    return skytap.environments
      .get({ configuration_id: env.remoteId })
      .then(function(skyenv) {
        env.skytap = skyenv;
      });
  });

  return Q.all(promises);
}