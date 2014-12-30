var Q         = require('q')
  , skytap    = require('node-skytap')
  , EnvMapper = require('../mappers/envMapper')
  , Env       = require('../models/env')
  , envMapper = new EnvMapper(__dirname + '/../../../deployer.db')
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
  paging = paging || {};
  paging.pagesize = paging.pagesize || 25;
  paging.page = paging.page || 1;

  return envMapper
    .findAll(paging)
    .nodeify(next);
};

module.exports.create = function create(data, next) {
  var env = new Env(data);
  
  return env
    .validate()
    .then(function() {
      return envMapper.insert(env);
    })
    .then(function(result) {
      env.envId = result.lastID;
      return env;
    })
    .nodeify(next);
};

module.exports.update = function update(env, next) {
  return EnvMapper
    .update(env)
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