var debug           = require('debug')('deployer-ringtail')
  , Q               = require('Q')  
  , ringtailSvc     = require('../services/ringtail-service')
  ;

exports.configs = function configs(req, res, next) {
  var role = req.param('role');
  ringtailSvc.roleConfigs(role, function(err, configs) {
    res.result = configs;
    res.err = err;
    next();
  });  
};