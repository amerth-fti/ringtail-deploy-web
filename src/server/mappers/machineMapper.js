var util          = require('util')
  , Q             = require('q')
  , statements    = require('statements')
  , SqliteMapper  = require('hops-sqlite')
  , Machine            = require('../models/machine')
  , machineSql         = statements.read(__dirname + '/machine.sql')
  ;



function MachineMapper() {
  SqliteMapper.apply(this, arguments);
}
util.inherits(MachineMapper, SqliteMapper);

module.exports = MachineMapper;

MachineMapper.prototype.parse = function parse(record) {
  return new Machine(record);
};

MachineMapper.prototype.parseArray = function parseArray(array) {
  var self = this;
  return array.map(function(record) {
    return new Machine(record);
  });
};


MachineMapper.prototype.insert = function insert(machine, next) {
  var sql = machineSql.insert
    , params
    ;

  params = {
    $envId: machine.envId,
    $machineName: machine.machineName,
    $machineDesc: machine.machineDesc,
    $remoteId: machine.remoteId,
    $intIP: machine.intIP,
    $extIP: machine.extIP,
    $role: machine.role,
    $installNotes: machine.installNotes,
    $registryNotes: machine.registryNotes
  };

  return this.run(sql, params, next);
};

MachineMapper.prototype.update = function update(machine, next) {
var sql = machineSql.update
    , params
    ;

  params = {
    $machineId: machine.machineId,
    $envId: machine.envId,
    $machineName: machine.machineName,
    $machineDesc: machine.machineDesc,
    $remoteId: machine.remoteId,
    $intIP: machine.intIP,
    $extIP: machine.extIP,
    $role: machine.role,
    $installNotes: machine.installNotes,
    $registryNotes: machine.registryNotes
  };

  return this.run(sql, params, next);
};


MachineMapper.prototype.del = function del(machineId, next) {
  var sql = machineSql.delete
    , params;

  params = {
    $machineId: machineId
  };

  return this.run(sql, params, next);
};


MachineMapper.prototype.findAll = function findAll(paging, next) {
  var sql = machineSql.findAll
    , params
    ;

  params = {
    $pagesize: paging.pagesize,
    $offset: (paging.page - 1) * paging.pagesize
  };

  return this
    .all(sql, params)
    .then(this.parseArray)
    .nodeify(next);
};

MachineMapper.prototype.findByEnv = function findByEnv(envId, next) {
  var sql = machineSql.findByEnv
    , params
    ;

  params = {
    $envId: envId
  };

  return this
    .all(sql, params)
    .then(this.parseArray)
    .nodeify(next);
};


MachineMapper.prototype.findById = function findById(machineId, next) {
  var sql = machineSql.findById
    , params
    ;

  params = {
    $machineId: machineId
  };

  return this
    .get(sql, params)
    .then(this.parse)
    .nodeify(next);
};