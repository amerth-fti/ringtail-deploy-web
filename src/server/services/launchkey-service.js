var debug         = require('debug')('deployer-launchkey-service')
  , Q             = require('q')
  , _ = require('underscore')  
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


exports.sendLaunchKeys = function sendLaunchKeys(data, next) {
  var me = this,
    envId = data.envId;

  debug('sending launch keys to env %s', envId);

  return machineMapper
    .findByEnv(envId)
    .then(function(result) {
      _.each(result, function(machine) {
        var newData = { machineId: machine.machineId, launchKeys: data.launchKeys};
        me.sendLaunchKeysToMachine(newData, next);
      });
    });
};

exports.sendLaunchKeysToMachine = function sendLaunchKeys(data, next) {
  var me = this,
    formattedLaunchKeys = {},
    launchKeys = data.launchKeys,
    machineId = data.machineId,
    serviceIP,
    machine,
    client;

  _.each(launchKeys, function(key) {
    // ringtail-deploy-service.DataCamel reverse converts this, and if you change this you will break it, so if you need to change this, change the consumer too please.
    var configKey = 'LAUNCHKEY|' + key.FeatureKey;
    formattedLaunchKeys[configKey] = key.MinorKey + '|' + key.Description;
  });

  debug('sending launch keys %j', formattedLaunchKeys);

  return machineService
    .get(machineId)
    .then(function(result) {
      machine   = result;
      serviceIP = result.intIP;
    });
    // TODO: Re-wire this so it saves the data into the sql lite config table in the 'launchKey' column.


    // ABANDONWARE - this works, except that it gets wiped out between writing this and the update happening, so it will never actuall light any features.
    // .then(function(result) {
    //   client = me.serviceClient = new RingtailClient({ serviceHost: serviceIP });
    // })
    // .then(function(result) {
    //   client
    //     .setConfigs(formattedLaunchKeys)
    //     .nodeify(next);
    // });
};