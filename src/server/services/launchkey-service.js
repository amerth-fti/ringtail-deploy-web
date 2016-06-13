var debug         = require('debug')('deployer-launchkey-service')
  , Q             = require('q')
  , _ = require('underscore')  
  , dbPath          = __dirname + '/../../../data/deployer.db'  
  , MachineMapper   = require('../mappers/machine-mapper')
  , machineService  = require('./machine-service')
  , ConfigMapper   = require('../mappers/config-mapper')
  , RingtailClient = require('ringtail-deploy-client')
  , machineMapper   = new MachineMapper(dbPath)  
  , configMapper   = new ConfigMapper(dbPath)  
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
    envId = data.envId,
    launchKeys = data.launchKeys,
    formattedLaunchKeys = {},
    launchJson;

  _.each(launchKeys, function(key) {
    // ringtail-deploy-service.DataCamel reverse converts this, and if you change this you will break it, 
    // so if you need to change this, change the consumer too please.
    var configKey = 'LAUNCHKEY|' + key.FeatureKey;
    formattedLaunchKeys[configKey] = key.MinorKey + '|' + key.Description;
  });


  return configMapper
    .findByEnv(envId)
    .then(function(result){
      var configs = result;
      configs.forEach(function(config){
        config.launchKey = formattedLaunchKeys;
        configMapper.update(config);
      });
      var result = {configs: configs};
      return result;
    }).nodeify(next);
};

exports.getLitKeys = function getLitKeys(data, next) {
var branch = data.branch,
    me = this,
    envId = data.envId,
    machineId,
    serviceIP,
    machine,
    client,
    keys,
    connectionString;

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

          return configMapper
            .findByEnv(envId)
            .then(function(result){
              var configs = result,
                  db,
                  password,
                  server,
                  user;

              configs.forEach(function(config){
                 if(config && config.data && config.data['Ringtail8|IS_SQLSERVER_DATABASE']){
                   db = config.data['Ringtail8|IS_SQLSERVER_DATABASE'];
                   password = config.data['Ringtail8|IS_SQLSERVER_PASSWORD'];
                   server = config.data['Ringtail8|IS_SQLSERVER_SERVER'];
                   user = config.data['Ringtail8|IS_SQLSERVER_USERNAME'];

                   return connectionString = 'Data Source = ' + server + ';Initial Catalog = ' + db + ';User id = ' + user + ';Password = ' + password + ';';
                 }
              });
            });
        })
        .then(function(result) {
          client = me.serviceClient = new RingtailClient({ serviceHost: serviceIP });
        })
        .then(function(result) {
          client
            .getLitKeys(connectionString, branch)
            .nodeify(next);
        });
    });
};