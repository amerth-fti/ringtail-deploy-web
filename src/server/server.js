var path        = require('path')  
  , debug       = require('debug')('deployer-app')
  , express     = require('express')
  , serveStatic = require('serve-static')  
  , bodyParser  = require('body-parser')
  , controllers = require('./controllers')
  , config      = require('../../config')
  , app;

app = express();

// CONFIGURE BODY PARSER
app.use(bodyParser.json());


// STATIC FILE ROUTES
app.use('/client/assets/lib', serveStatic(__dirname + '/../client/assets/bower_components'));
app.use('/client', serveStatic(__dirname + '/../client'));


// DEFAULT ROUTE
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname +'/../client/index.html'));
});



// API - CLIENT SIDE CONFIG
app.get('/config', function(req, res) {
  res
    .type('json')
    .send('window.appConfig = ' + JSON.stringify(config.client));
});


// API - PROJECT ROUTES
app.get('/api/projects', controllers.projects.list);
app.get('/api/projects/:projectId/', controllers.projects.get);
app.get('/api/projects/:projectId/templates', controllers.projects.templates);
app.get('/api/projects/:projectId/environments', controllers.projects.environments);


// API - ENVIRONMENT ROUTES
app.get ('/api/environments', controllers.environments.list);
app.get ('/api/environments/:environmentId', controllers.environments.get);
app.put ('/api/environments/:environmentId', controllers.environments.update);
app.put ('/api/environments/:environmentId/start', controllers.environments.start);
app.put ('/api/environments/:environmentId/pause', controllers.environments.pause);
app.put ('/api/environments/:environmentId/redeploy', controllers.environments.redeploy);

app.get ('/api/env', controllers.env.list);
app.post('/api/env', controllers.env.create);
app.put ('/api/env/:envId', controllers.env.update);
//app.del ('/api/env/:envId', controllers.env.del);
//app.get ('/api/env/:envId', controllers.env.get);

app.post('/api/imports/skytap', controllers.imports.skytap);

app.get ('/api/configs', controllers.configs.list);
app.post('/api/configs', controllers.configs.create);
app.put ('/api/configs/:configId', controllers.configs.update);
//app.del ('/api/configs/:configId', controllers.configs.del);
//app.get ('/api/configs/:configId', controllers.configs.get);

// API - TASK ROUTES
app.get ('/api/jobs', controllers.jobs.list);
app.get ('/api/jobs/:jobId', controllers.jobs.get);


console.log('Listening on %s:%d ', (config.host ? config.host : '*'), config.port);
if(config.host) {
  app.listen(config.port, config.host);
} else {
  app.listen(config.port);
}