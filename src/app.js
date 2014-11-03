var debug       = require('debug')('app')
  , express     = require('express')
  , serveStatic = require('serve-static')
  , config      = require('../config')


  , skytap      = require('node-skytap')

  , app;

app = express();

app.use('/pub/dep', serveStatic(__dirname + '/../bower_components'));

app.get('/', function(req, res) {
  res.sendFile(__dirname +'/index.html');
});

app.get('/api/environments', function(req, res) {
  var name = req.param('name')
    , opts;

  opts = {
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
    .then(function(list) {
      res.send(list);
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


