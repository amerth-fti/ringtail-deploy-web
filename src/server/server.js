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
app.use('/app/assets/lib', serveStatic(__dirname + '/../client/assets/bower_components'));
app.use('/app', serveStatic(__dirname + '/../client'));


// DEFAULT ROUTE
function defaultRoute(req, res) {
  res.sendFile(path.resolve(__dirname +'/../client/index.html'));
}
app.get('/', defaultRoute);
app.get('/app/*', defaultRoute);



// API - CLIENT SIDE CONFIG
app.get('/config', function(req, res) {
  res
    .type('json')
    .send('window.appConfig = ' + JSON.stringify(config.client));
});


// API - ENVIRONMENT ROUTES
app.get ('/api/envs', controllers.envs.list);
app.post('/api/envs', controllers.envs.create);
app.get ('/api/envs/:envId', controllers.envs.get);
app.put ('/api/envs/:envId', controllers.envs.update);
app.put ('/api/envs/:envId/start', controllers.envs.start);
app.put ('/api/envs/:envId/pause', controllers.envs.pause);
app.put ('/api/envs/:envId/redeploy', controllers.envs.redeploy);
app.put ('/api/envs/:envId/reset', controllers.envs.reset);


// API - TASK ROUTES
app.get ('/api/jobs', controllers.jobs.list);
app.get ('/api/jobs/:jobId', controllers.jobs.get);


// API - SKYTAP PROXY ROUTES
app.get ('/api/skytap/environments', controllers.skytap.environments);
app.get ('/api/skytap/environments/:configuration_id', controllers.skytap.environment);



// CONVERT TO UNIVERSAL HANDLER
app.all ('/api/*', function(req, res) {

  if(res.result) {
    var client = convertToClient(res.result);
    res.status(200).send(client);
  } else if (res.err) {
    console.error(res.err);
    console.error(res.err.trace);
    res.status(500).send(res.err);
  }

});

function convertToClient(results) {
  var util = require('util');
  if(results && results.toClient) {
    results = results.toClient();
  }
  else if(util.isArray(results)) {    
    results = results.map(function(result) {
      if(result.toClient) {
        result = result.toClient();
      }
      return result;
    });
  }
  else if (results instanceof Object) {
    for(var prop in results) {
      if(results[prop] instanceof Object) {
        results[prop] = convertToClient(results[prop]);
      }
    }
  }
  return results;
}




console.log('Listening on %s:%d ', (config.host ? config.host : '*'), config.port);
if(config.host) {
  app.listen(config.port, config.host);
} else {
  app.listen(config.port);
}