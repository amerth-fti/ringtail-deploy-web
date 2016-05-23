var debug         = require('debug')('deployer-launchkey-service')
  , Q             = require('q')
  , machineService  = require('./machine-service')
  , RingtailClient = require('ringtail-deploy-client')
  , create
  , update
  , del
  ;

exports.requestLaunchKeys = function requestLaunchKeys(data, next) {
  return [];
  // debug('requestLaunchKeys %j', data);
  // var branch = data.branch,
  //   me = this,
  //   machineId = data.machineId,
  //   serviceIP,
  //   machine,
  //   client;

  //   machineService
  //   .get(machineId)
  //   .then(function(result) {
  //     machine   = result;
  //     serviceIP = result.intIP;
  //   });
  //   client = me.serviceClient = new RingtailClient({ serviceHost: serviceIP });
  //   return client.getLaunchKeys(branch);
};
