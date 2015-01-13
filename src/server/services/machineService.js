var Q             = require('q')
  , MachineMapper = require('../mappers/machineMapper')
  , Machine       = require('../models/machine')
  , dbPath        = __dirname + '/../../../data/deployer.db'
  , machineMapper = new MachineMapper(dbPath)
  ;


exports.create = function create(data, next) {
  var machine = new Machine(data);
  
  return machine
    .validate()
    .then(function() {
      return machineMapper.insert(machine);
    })
    .then(function(result) {
      machine.machineId = result.lastID;
      return machine;
    })
    .nodeify(next);
};

exports.update = function update(data, next) {
  var machine = new Machine(data);

  return machine
    .validate()
    .then(function() {
      return machineMapper.update(machine);      
    })
    .then(function() {
      return machine;
    })
    .nodeify(next);
};

exports.get = function get(machineId, next) {
  return machineMapper
    .findById(machineId)
    .nodeify(next);
};