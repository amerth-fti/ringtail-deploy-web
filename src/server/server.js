var path        = require('path')
  , debug       = require('debug')('app')
  , express     = require('express')
  , serveStatic = require('serve-static')
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
  var opts = {
    id: req.param('projectId'),
    username: config.skytap.username,
    token: config.skytap.token
  };

  skytap.projects.environments(opts)
  .then(function(list) {
    res.send(list);
  })
  .fail(function(err) {
    res.send(500, err);
  });
});


console.log('Listening on port 8000');
app.listen(8000);


