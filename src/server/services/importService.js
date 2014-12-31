var Q               = require('q')
  , Skytap          = require('node-skytap')
  , envService      = require('./envService')
  , machineService  = require('./machineService')
  , config          = require('../../../config')
  , skytap          = Skytap.init(config.skytap)
  ;

exports.skytap = function (configuration_id, next) {
  var scope = {};
  // get from skytap
  return skytap.environments
    .get({ configuration_id: configuration_id })
    .then(function(skytapEnv) {
      scope.skytapEnv = skytapEnv;
    })

    // create the env
    .then(function() {
      var skytapEnv = scope.skytapEnv;
      return envService.create({ 
        envName: skytapEnv.name,
        envDesc: skytapEnv.description,
        remoteType: 'skytap',
        remoteId: skytapEnv.id
      });
    })
    .then(function(env) {
      scope.env = env;
    })

    // create the machine references
    .then(function() {
      var skytapEnv = scope.skytapEnv
        , env       = scope.env
        , promises;

      promises = skytapEnv.vms.map(function(vm) {
        return machineService.create({
          envId: env.envId,
          machineName: vm.name,
          remoteId: vm.id,
          intIP: vm.interfaces[0].nat_addresses.vpn_nat_addresses[0].ip_address,
        });
      });

      return Q.all(promises);
    })
    .then(function(machines) {
      scope.machines = machines;
    })

    // return result
    .then(function() {
      var env = scope.env;
      env.machines = scope.machines;
      env.skytap = scope.skytapEnv;
      return env;
    })

    .nodeify(next);
};
  