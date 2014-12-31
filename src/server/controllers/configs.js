var debug       = require('debug')('deployer-configs')  
  , Q           = require('q')    
  , configService  = require('../services/configService')
  ;


exports.list = function list(req, res) {
  configService
    .findAll(null)
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
  configService
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
  configService
    .update(data)
    .then(function(result) {
      res.send(result);
    })
    .fail(function(err) {
      console.error(err);
      res.status(500).send(err);
    });
};