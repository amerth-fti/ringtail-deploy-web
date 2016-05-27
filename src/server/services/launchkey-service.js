var debug         = require('debug')('deployer-launchkey-service')
  , Q             = require('q')
  , machineService  = require('./machine-service')
  , RingtailClient = require('ringtail-deploy-client')
  , create
  , update
  , del
  ;

exports.requestLaunchKeys = function requestLaunchKeys(data, next) {
  debug('requestLaunchKeys %j', data);
  var branch = data.branch,
    me = this,
    machineId = data.machineId,
    serviceIP,
    machine,
    client,
    keys;

  machineService
    .get(machineId)
    .then(function(result) {
      machine   = result;
      serviceIP = result.intIP;
    })
    .then(function(result) {
      debug('requestLaunchKeys %j', serviceIP);
      client = me.serviceClient = new RingtailClient({ serviceHost: serviceIP });
      keys =  client.getLaunchKeys(branch);
      debug('requestLaunchKeys %j', keys);
    });


  return keys;
};
