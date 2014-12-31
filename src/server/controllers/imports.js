var debug           = require('debug')('deployer-imports')  
  , Q               = require('q')  
  , importService   = require('../services/importService')
  ;


exports.skytap = function skytap(req, res) {
  var configuration_id = req.param('configuration_id');

  importService
    .skytap(configuration_id)
    .then(function(env) {
      res.send(env);
    })
    .fail(function(err){
      console.error(err);
      res.status(500).send(err);
    });
};