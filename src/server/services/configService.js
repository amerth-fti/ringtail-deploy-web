var Q             = require('q')
  , ConfigMapper  = require('../mappers/configMapper')
  , Config        = require('../models/config')
  , dbPath        = __dirname + '/../../../deployer.db'
  , configMapper = new ConfigMapper(dbPath)
  ;




module.exports.create = function create(data, next) {
  var config = new Config(data);
  
  return config
    .validate()
    .then(function() {
      return configMapper.insert(config);
    })
    .then(function(result) {
      config.configId = result.lastID;
      return config;
    })
    .nodeify(next);
};


module.exports.update = function update(data, next) {
  var config = new Config(data);

  return config
    .validate()
    .then(function() {
      return configMapper.update(config);
    })
    .nodeify(next);
};


module.exports.findAll = function findAll(paging, next) {
  paging = paging || {};
  paging.pagesize = paging.pagesize || 25;
  paging.page = paging.page || 1;

  return configMapper
    .findAll(paging)
    .nodeify(next);
};

module.exports.findById = function findById(configId, next) {
  return configMapper
    .findById(configId)
    .nodeify(next);
};