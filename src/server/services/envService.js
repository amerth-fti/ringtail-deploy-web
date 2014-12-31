var Q             = require('q')
  , Skytap        = require('node-skytap')
  , EnvMapper     = require('../mappers/envMapper')
  , MachineMapper = require('../mappers/machineMapper')
  , Env           = require('../models/env')
  , config        = require('../../../config')
  , dbPath        = __dirname + '/../../../deployer.db'
  , skytap        = Skytap.init(config.skytap)
  , envMapper     = new EnvMapper(dbPath)
  , machineMapper = new MachineMapper(dbPath)
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
    .then(joinMachines)
    //.then(joinSkytap)
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

module.exports.update = function update(data, next) {
  var env = new Env(data);

  return env
    .validate()
    .then(function() {
      return envMapper.update(env);
    })
    .then(function() {
      return env;
    })
    .nodeify(next);
};

/**
 * Helper function to join vms
 * 
 * @api private
 * @param {Array|Machin}
 */
function joinMachines(envs) {
  var array = []
    , promises
    ;

  if(!Array.isArray(envs)) {
    array.push(envs);
  } else {
    array = envs;
  }

  promises = array.map(function(env) {
    return machineMapper
      .findByEnv(env.envId)
      .then(function(vms) {
        env.vms = vms;
        return env;
      });
  });

  return Q.all(promises);
}


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
    if(env.remoteType === 'skytap' && env.remoteId) {
      return skytap.environments
        .get({ configuration_id: env.remoteId })
        .then(function(skyenv) {
          env.skytap = skyenv;
          return env;
        });
    } else {
      return null;
    } 
  });

  return Q.all(promises);
}