let debug           = require('debug')('deployer-skytap')
  , Q               = require('q')
  , Skytap          = require('node-skytap')
  , config          = require('../../../config');

if(process.env.skytapUser && process.env.skytapToken) {
  config.skytap.username = process.env.skytapUser;
  config.skytap.token = process.env.skytapToken;

  if(process.env.skytapProxy) {
    config.skytap.proxy = process.env.skytapProxy;
  }
}

let skytap = Skytap.init(config.skytap);

exports.environments = function environments(req, res, next) {

  skytap.environments.list(function(err, results) {
    res.result = results;
    res.err = err;
    next();
  });
};

exports.environment = function environment(req, res, next) {
  let configuration_id = req.param('configuration_id');

  skytap.environments.get({ configuration_id: configuration_id }, function(err, result) {
    res.result = result;
    res.err    = err;
    next();
  });
};