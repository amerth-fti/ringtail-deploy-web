var Q             = require('q')
  , MachineMapper = require('../mappers/machineMapper')
  , Machine       = require('../models/machine')
  , dbPath        = __dirname + '/../../../deployer.db'
  , machineMapper = new MachineMapper(dbPath)
  ;




module.exports.create = function create(data, next) {
  var machine = new Machine(data);
  
  return machine
    .validate()
    .then(function() {
      return machineMapper.insert(machine);
    })
    .then(function(result) {
      machine.machinId = result.lastID;
      return machine;
    })
    .nodeify(next);
};