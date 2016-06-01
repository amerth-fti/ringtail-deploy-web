var debug         = require('debug')('deployer-launchkey-service')
  , Q             = require('q')
  , dbPath          = __dirname + '/../../../data/deployer.db'  
  , MachineMapper   = require('../mappers/machine-mapper')
  , machineService  = require('./machine-service')
  , RingtailClient = require('ringtail-deploy-client')
  , machineMapper   = new MachineMapper(dbPath)  
  , create
  , update
  , del
  ;

exports.requestLaunchKeys = function requestLaunchKeys(data, next) {
  var branch = data.branch,
    me = this,
    envId = data.envId,
    machineId = data.machineId,
    serviceIP,
    machine,
    client,
    keys;

  debug('requesting launch keys');

  return machineMapper
    .findByEnv(envId)
    .then(function(result) {
      machineId = result[0].machineId;
      machineService
        .get(machineId)
        .then(function(result) {
          machine   = result;
          serviceIP = result.intIP;
        })
        .then(function(result) {
          client = me.serviceClient = new RingtailClient({ serviceHost: serviceIP });
        })
        .then(function(result) {
          client
            .getLaunchKeys(branch)
            .nodeify(next);
        });
    });
};
