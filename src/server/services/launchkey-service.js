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

  debug('requesting available launch keys');

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
    formattedLaunchKeys[configKey] = key.Description;
  });

  debug('formatted launch keys for env ' + envId + ' %j', formattedLaunchKeys);

  return configMapper
    .findByEnv(envId)
    .then(function(result){
      var configs = result;
      configs.forEach(function(config){
        config.launchKey = formattedLaunchKeys;
        debug('sending launch keys %j', config.launchKey);
        configMapper.update(config);
      });
      return {configs: configs};
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

  debug('requesting lit keys');

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
                  user,
                  configKeyParts,
                  configSource;

                configs.forEach(function (config){
                    if (config && config.data) {
                        Object.getOwnPropertyNames(config.data).some(function (val, idx, array) {
                            configKeyParts = val.split('|');
                            if (configKeyParts && configKeyParts.length == 2) {
                                if (configKeyParts[1] === 'IS_SQLSERVER_DATABASE') {
                                    configSource = configKeyParts[0];
                                    return true;
                                }
                            }
                        });

                        if (!!configSource) {
                            db = config.data[configSource + '|IS_SQLSERVER_DATABASE'];
                            password = config.data[configSource + '|IS_SQLSERVER_PASSWORD'];
                            server = config.data[configSource + '|IS_SQLSERVER_SERVER'];
                            user = config.data[configSource + '|IS_SQLSERVER_USERNAME'];
                            
                            return connectionString = 'Data Source = ' + server + ';Initial Catalog = ' + db + ';User id = ' + user + ';Password = ' + password + ';';
                        }
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