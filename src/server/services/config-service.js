var debug         = require('debug')('deployer-config-service')
  , Q             = require('q')
  // , MachineMapper = require('../mappers/machine-mapper')
  // , Machine       = require('../models/machine')
  // , dbPath        = __dirname + '/../../../data/deployer.db'
  // , machineMapper = new MachineMapper(dbPath)  
  ;

exports.create = function create(data, next) {
  return new Q().nodeify(next);
};