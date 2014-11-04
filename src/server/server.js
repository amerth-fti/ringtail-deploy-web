var path        = require('path')  
  , debug       = require('debug')('app')
  , express     = require('express')
  , serveStatic = require('serve-static')
  , Q           = require('q')
  , _           = require('underscore')
  , config      = require('../../config')


  , skytap      = require('node-skytap')

  , app;

app = express();

app.use('/app/dep', serveStatic(__dirname + '/../app/bower_components'));
app.use('/app/css', serveStatic(__dirname + '/../app/css'));
app.use('/app/js',  serveStatic(__dirname + '/../app/js'));
app.use('/app/img', serveStatic(__dirname + '/../app/img'));
app.use('/app/partials', serveStatic(__dirname + '/../app/partials'));

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname +'/../app/index.html'));
});

app.get('/api/environments', function(req, res) {
  
  var opts = {
    username: config.skytap.username,
    token: config.skytap.token,
  };  

  skytap.environments.list(opts)
  .then(function(list) {
    res.send(list);
  })
  .fail(function(err) {
    res.send(500, err);
  });

});

app.get('/api/environments/:environmentId', function(req, res) {

  var opts = {
    id: req.param('environmentId'),
    username: config.skytap.username,
    token: config.skytap.token,
  };  

  skytap.environments.get(opts)
  .then(function(instance) {
    res.send(instance);
  })
  .fail(function(err) {
    res.send(500, err);
  });

})

app.get('/api/projects', function(req, res) {
  var opts = {
    username: config.skytap.username,
    token: config.skytap.token
  };

  skytap.projects.list(opts)
  .then(function(list) {
    res.send(list);
  })
  .fail(function(err) {
    res.send(500, err);
  });
});

app.get('/api/projects/:projectId/', function(req, res) {
  var opts = {
      id: req.param('projectId'),
      username: config.skytap.username,
      token: config.skytap.token
    };

    skytap.projects.get(opts)
    .then(function(project) {
      res.send(project);
    })
    .fail(function(err) {
      res.send(500, err);
    });
});

app.get('/api/projects/:projectId/templates', function(req, res) {
  var opts = {
    id: req.param('projectId'),
    username: config.skytap.username,
    token: config.skytap.token
  };

  skytap.projects.templates(opts)
  .then(function(list) {
    res.send(list);
  })
  .fail(function(err) {
    res.send(500, err);
  });
});

app.get('/api/projects/:projectId/environments', function(req, res) {

  var simple = req.param('simple') || false
    , opts;

  opts = {
    id: req.param('projectId'),
    username: config.skytap.username,
    token: config.skytap.token
  };

  skytap.projects.environments(opts)  
  .then(function(environments) {

    // send simple response
    if(simple) {
      res.send(environments);
    } 

    // send detailed response
    else {

      var promises = environments.map(function(environment) { 
        debug('Requesting details for %s', environment.id);
        return skytap.environments.get({ 
          id: environment.id,
          username: config.skytap.username,
          token: config.skytap.token
        }); 
      });

      return Q.all(promises)
      .then(function(environments) {
        debug('Found details for %d', environments.length)
        res.send(environments);
      })
      .fail(function(err) {
        debug('Failed retrieving details');
        res.status(500).send(err);
      });
    }

  })
  .fail(function(err) {
    res.status(500).send(err);
  });
});



app.put ('/api/environments/:environmentId/start', function(req, res) {
  
  var environmentId = req.param('environmentId') 
    , suspendOnIdle = req.param('suspend_on_idle')
    , opts

  opts = {
    id: environmentId,
    username: config.skytap.username,
    token: config.skytap.token,
    body: {
      suspend_on_idle: suspendOnIdle,
      runstate: 'running'
    }
  };

  skytap.environments.update(opts, function(err, env) {
    if(err) res.status(500).send(err);
    else res.send(env);
  }); 

});


app.put ('/api/environments/:environmentId/pause', function(req, res) {

  var environmentId = req.param('environmentId')
    , opts;

  opts = {
    id: environmentId,
    username: config.skytap.username,
    token: config.skytap.token,
    body: {
      runstate: 'suspended'
    }
  };

  skytap.environments.update(opts, function(err, env) {
    if(err) res.status(500).send(err);
    else res.send(env);
  });

})


console.log('Listening on port 8000');
app.listen(8000);


