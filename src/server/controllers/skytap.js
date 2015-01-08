var debug           = require('debug')('deployer-environments')
  , Q               = require('Q')
  , Skytap          = require('node-skytap')
  , config          = require('../../../config')
  , skytap          = Skytap.init(config.skytap)
  ;

exports.environments = function environments(req, res, next) {

  skytap.environments.list(function(err, results) {
    res.result = results;
    res.err = err;
    next();
  });
  
};