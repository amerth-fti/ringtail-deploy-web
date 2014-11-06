var debug   = require('debug')('deployer-projects')
  , _       = require('underscore')
  , Q       = require('q')
  , skytap  = require('node-skytap')
  , config  = require('../../../config');



exports.list = function list(req, res) {
  var opts = _.clone(config.skytap);

  skytap.projects.list(opts, function(err, projects) {
    if(err) res.status(500).send(err);
    else res.send(projects);
  });  
}



exports.get = function get(req, res) {
  var opts = _.clone(config.skytap);

  opts.params = {
    id: req.param('projectId')    
  };

  skytap.projects.get(opts, function(err, project) {
    if(err) res.status(500).send(err);
    else res.send(project);
  });
}



exports.templates = function template(req, res) {  
  var opts = _.clone(config.skytap);
  
  opts.params = {
    id: req.param('projectId')
  };

  skytap.projects.templates(opts, function(err, templates) {
    if(err) res.status(500).send(err);
    else res.send(project);
  });
}



exports.environments = function environments(req, res) {
  var simple = req.param('simple') || false
    , opts = _.clone(config.skytap);

  opts.params = {
    id: req.param('projectId')
  }

  skytap.projects.environments(opts, function(err, envs) {
    if(err) res.status(500).send(err);
    else res.send(envs);
  });
}
