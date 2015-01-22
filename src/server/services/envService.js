var debug           = require('debug')('deployer-envservice')
  , Q               = require('q')
  , Skytap          = require('node-skytap')
  , EnvMapper       = require('../mappers/envMapper')
  , MachineMapper   = require('../mappers/machineMapper')
  , Env             = require('../models/env')
  , config          = require('../../../config')
  , dbPath          = __dirname + '/../../../data/deployer.db'
  , machineService  = require('./machineService')
  , skytap          = Skytap.init(config.skytap)
  , envMapper       = new EnvMapper(dbPath)
  , machineMapper   = new MachineMapper(dbPath)  
  , findById
  ;

/** 
 * Gets the list of environments
 *
 * @api public
 * @param {Object} paging
 * @param {Function} next
 * @return {Promise} resolves to Array[Env]
 */
exports.findAll = function list(paging, next) {
  paging = paging || {};
  paging.pagesize = paging.pagesize || 25;
  paging.page = paging.page || 1;

  return envMapper.findAll(paging)
    .then(joinEnvsMachines)
    .then(joinEnvsSkytap)
    .nodeify(next);
};


exports.findById = findById = function get(envId, next) {
  return envMapper.findById(envId)
    .then(joinEnvMachines)
    .then(joinEnvSkytap)
    .nodeify(next);
};



exports.create = function create(data, next) {
  var env = new Env(data);
  
  return env
    .validate()
    .then(function() { 
      return envMapper
        .insert(env)
        .then(function(result) {
          env.envId = result.lastID;
          return env;
        });
    })
    .then(function() {
      return machineService
        .createMany(env.envId, env.machines)
        .then(function(machines) {
          env.machines = machines;
          return env;
        });
    })    
    .then(joinEnvSkytap)
    .nodeify(next);
};

exports.update = function update(data, next) {
  debug('update environment');
  var env = new Env(data);
  
  return env.validate()
    .then(function() { return envMapper.update(env); })
    .then(function() {
      return findById(env.envId)
        .then(function(found) {
          return machineService
            .sync(env.envId, found.machines, env.machines);
        })
        .then(function(machines) {
          env.machines = machines;
          return env;
        });
    })
    .then(joinEnvMachines)
    .then(joinEnvSkytap)
    .nodeify(next);
};

exports.start = function start(data, suspendOnIdle, next) {  
  var env = new Env(data)
    , opts;

  opts = {
    configuration_id: env.remoteId,
    suspend_on_idle: suspendOnIdle,
    runstate: 'running'
  };
    
  return skytap.environments.update(opts)
    .then(function() { return envMapper.update(env); })
    .then(function(result) { return env; })
    .then(joinEnvMachines)
    .then(joinEnvSkytap)
    .nodeify(next);
};


exports.pause = function pause(data, next) {
  var env = new Env(data)
    , opts;

  opts = {
    configuration_id: env.remoteId,
    runstate: 'suspended'
  };

  return skytap.environments.update(opts)
    .then(function() { return env; })
    .then(joinEnvMachines)
    .then(joinEnvSkytap)
    .nodeify(next);
};


exports.reset = function reset(envId, next) {
  var env;  

  return envMapper.findById(envId)
    .then(function(found) {
      env = found;
      env.status = 'deployed';
    })
    .then(function() {
      return envMapper.update(env)
        .then(function() {
          return env;
        });
    }) 
    .then(joinEnvMachines)
    .then(joinEnvSkytap)
    .nodeify(next);
};

/**
 * Helper function to join machines for the list of envs
 * 
 * @api private
 * @param {Array} envs
 */
function joinEnvsMachines(envs) {
  var promises = envs.map(joinEnvMachines);
  return Q.all(promises);    
}

/**
 * Helper function to join machines for an env
 *
 * @api private
 * @param {Env} env
 */
function joinEnvMachines(env) {
  return machineMapper.findByEnv(env.envId)
    .then(function(machines) {
      env.machines = machines;
      return env;
    });
}

/**
 * Helper function to join skytap data for a list of envs
 * 
 * @api private
 * @param {Array[Env]} envs
 */
function joinEnvsSkytap(envs) {
  var promises = envs.map(joinEnvSkytap);
  return Q.all(promises);
}

/**
 * Helper function to join skytap data for a list of envs
 * 
 * @api private
 * @param {Env} env
 */
function joinEnvSkytap(env) {
  if(env.remoteType === 'skytap' && env.remoteId) {
    return skytap.environments.get({ configuration_id: env.remoteId })
      .then(function(skyenv) {
        env.runstate = skyenv.runstate;
        return env;
      }, function() {
        debug('Could not find env %d', env.remoteId);
        return env;
      });
  } else {
    return env;
  }
}