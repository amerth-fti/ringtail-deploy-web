var debug         = require('debug')('deployer-config-service')
  , Q             = require('q')
  , ConfigMapper  = require('../mappers/config-mapper')
  , Config        = require('../models/config')
  , dbPath        = __dirname + '/../../../data/deployer.db'
  , configMapper  = new ConfigMapper(dbPath)
  , create
  , update
  , del
  ;

exports.create = create = function create(data, next) {
  debug('creating config %j', data);
  var config = new Config(data);
  
  return config
    .validate()
    .then(function() {
      return configMapper.insert(config);
    })
    .then(function(result) {
      debug('config %s created', result.lastID);
      config.configId = result.lastID;
      return config;
    })
    .nodeify(next);
};

exports.update = update = function update(data, next) {
  debug('updating config %s', data.configId);
  var config = new Config(data);

  return config
    .validate()
    .then(function() {
      return configMapper.update(config);      
    })
    .then(function() {
      return config;
    })
    .nodeify(next);
};

exports.get = function get(configId, next) {
  debug('get config %s', configId);
  return configMapper
    .findById(configId)
    .nodeify(next);
};

exports.del = del = function del(configId, next) {
  debug('deleting config %s', configId);
  return configMapper
    .del(configId)    
    .nodeify(next);
};

exports.findByEnv = function findByEnv(envId, next) {
  debug('finding configs for environment %s', envId);
  return configMapper
    .findByEnv(envId)
    .nodeify(next);
};