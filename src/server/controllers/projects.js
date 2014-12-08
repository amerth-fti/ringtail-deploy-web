var debug   = require('debug')('deployer-projects')  
  , Q       = require('q')
  , config  = require('../../../config')
  , Skytap  = require('node-skytap')
  , skytap  = Skytap.init(config.skytap);



exports.list = function list(req, res) {  
  skytap.projects.list(function(err, projects) {
    if(err) res.status(500).send(err);
    else res.send(projects);
  });  
};



exports.get = function get(req, res) {
  var opts = {
    project_id: req.param('projectId')    
  };

  skytap.projects.get(opts, function(err, project) {
    if(err) res.status(500).send(err);
    else res.send(project);
  });
};



exports.templates = function template(req, res) {  
  var opts = {
    project_id: req.param('projectId')
  };

  skytap.projects.templates(opts, function(err, templates) {
    if(err) res.status(500).send(err);
    else res.send(project);
  });
};



exports.environments = function environments(req, res) {
  var opts = {
    project_id: req.param('projectId')
  };

  skytap.projects.environments(opts, function(err, envs) {

    envs = envs.sort(function(a, b) {
      var aname = a.name.toLowerCase()
        , bname = b.name.toLowerCase();
      if(aname < bname) return -1;
      else if (aname > bname) return 1;
      else return 0;
    });
    
    if(err) res.status(500).send(err);
    else res.send(envs);
  });
};
