var debug           = require('debug')('deployer-branches')
  , _               = require('underscore')
  , Q               = require('q')
  , regionService   = require('../services/region-service')
  , browserFactory  = require('../services/browser-factory')  
  ;

exports.branches = function branches(req, res, next) {  
  var id = req.params.regionId;

  Q.fcall(function() { 
      return regionService.findById(id);
    })
    .then(function(region) {  
      return browserFactory.fromRegion(region);
    })
    .then(function(browser) {      
      return browser.branches();      
    })
    .then(function(branches) {
      res.send(branches);
    })
    .fail(function(err) {
      res.status(500).send(err.message);
    });
};

exports.builds = function builds(req, res, next) {
  var id      = req.params.regionId
    , branch  = req.params.branch
    ;

  Q.fcall(function() { 
      return regionService.findById(id);
    })
    .then(function(region) {  
      return browserFactory.fromRegion(region);
    })
    .then(function(browser) {
      return browser.builds(branch);      
    })
    .then(function(builds) {      
      res.send(builds);
    })
    .fail(function(err) {
      res.status(500).send(err.message);
    });
};

exports.files = function files(req, res, next) {
  var id      = req.params.regionId
    , branch  = req.params.branch
    , version = req.params.version
    ;

  Q.fcall(function() { 
      return regionService.findById(id);
    })
    .then(function(region) {  
      return browserFactory.fromRegion(region, version);
    })
    .then(function(browser) {
      return browser.files(branch);      
    })
    .then(function(files) {     
      res.send(files);
    })
    .fail(function(err) {
      res.status(500).send(err.message);
    });
};