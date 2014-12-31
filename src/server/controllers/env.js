var debug       = require('debug')('deployer-environments')  
  , Q           = require('q')  
  , _           = require('underscore')
  , Skytap      = require('node-skytap')
  , config      = require('../../../config')
  , Job         = require('../job')  
  , jobrunner   = require('../jobrunner')
  , taskfactory = require('../taskfactory')
  , skytap      = Skytap.init(config.skytap)
  , envService  = require('../services/envService')
  ;


exports.list = function list(req, res) {
  envService
    .list(null)
    .then(function(result) {
      res.send(result.map(function(x) { return x.toClient(); }));
    })
    .fail(function(err) {
      console.error(err);
      res.status(500).send(err);
    });
};


exports.create = function create(req, res) {
  var data = req.body;
  envService
    .create(data)
    .then(function(result) {
      res.send(result);
    })
    .fail(function(err) {
      console.error(err);
      res.status(500).send(err);
    });
};

exports.update = function update(req, res) {
  var data = req.body;
  envService
    .update(data)
    .then(function(result) {
      res.send(result);
    })
    .fail(function(err) {
      console.error(err);
      res.status(500).send(err);
    });
};