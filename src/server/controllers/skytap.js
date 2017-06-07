let debug           = require('debug')('deployer-skytap')
  , Q               = require('q')
  , Skytap          = require('node-skytap')
  , config          = require('../../../config');

let skytap = Skytap.init(config.skytap);

if(config.skytap.username == 'SKYTAP_USERNAME')
{
  //console.log("We are not configuring skytap");
  // create some empty api calls so theres no 500 errors 
  exports.environment = function environment(req, res, next) { };
  exports.environments = function environments(req, res, next) { }; 
}
else{
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
}