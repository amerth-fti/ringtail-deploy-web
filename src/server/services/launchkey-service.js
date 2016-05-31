var debug         = require('debug')('deployer-launchkey-service')
  , Q             = require('q')
  , machineService  = require('./machine-service')
  , RingtailClient = require('ringtail-deploy-client')
  , create
  , update
  , del
  ;

exports.requestLaunchKeys = function requestLaunchKeys(data, next) {
  var branch = data.branch,
    me = this,
    machineId = data.machineId,
    serviceIP,
    machine,
    client,
    keys;

  debug('requesting launch keys');

  return machineService
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
        // .then(function(result) {
        //   keys = result;
        // })
        
    });
};
