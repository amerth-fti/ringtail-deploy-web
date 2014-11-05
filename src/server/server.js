var path        = require('path')  
  , debug       = require('debug')('deployer-app')
  , express     = require('express')
  , serveStatic = require('serve-static')  
  , controllers = require('./controllers')
  , config      = require('../../config')
  , app;

app = express();


// STATIC FILE ROUTES
app.use('/app/dep', serveStatic(__dirname + '/../app/bower_components'));
app.use('/app/css', serveStatic(__dirname + '/../app/css'));
app.use('/app/js',  serveStatic(__dirname + '/../app/js'));
app.use('/app/img', serveStatic(__dirname + '/../app/img'));
app.use('/app/partials', serveStatic(__dirname + '/../app/partials'));


// DEFAULT ROUTE
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname +'/../app/index.html'));
});


// API - PROJECT ROUTES
app.get('/api/projects', controllers.projects.list);
app.get('/api/projects/:projectId/', controllers.projects.get);
app.get('/api/projects/:projectId/templates', controllers.projects.templates);
app.get('/api/projects/:projectId/environments', controllers.projects.environments);


// API - ENVIRONMENT ROUTES
app.get('/api/environments', controllers.environments.list);
app.get('/api/environments/:environmentId', controllers.environments.get);
app.put ('/api/environments/:environmentId/start', controllers.environments.start);
app.put ('/api/environments/:environmentId/pause', controllers.environments.pause);


console.log('Listening on port %d', config.port);
app.listen(config.port);