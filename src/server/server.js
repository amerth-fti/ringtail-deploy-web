var path        = require('path')
  , debug       = require('debug')('deployer')
  , express     = require('express')
  , serveStatic = require('serve-static')
  , bodyParser  = require('body-parser')
  , controllers = require('./controllers')
  , config      = require('../../config')
  , stylus      = require('stylus')
  , nib         = require('nib')
  , join        = require('path').join
  , session     = require('express-session')
  , cookieParser = require('cookie-parser')
  , migrate     = require('migrate')
  , app;

app = express();

//STYLUS MIDDLEWARE
var stylusDir = join(__dirname, '/../client/assets/stylus');
var cssDir = join(__dirname, '/../client/');

function compile(str, path){
  return stylus(str)
  .set('filename', path)
  .use(nib());
}

app.use(stylus.middleware({
  src: cssDir,
  debug: true,
  force: true,
  compile: compile
}));

// CONFIGURE BODY PARSER
app.use(bodyParser.json({ limit: '1mb' }));
app.use(cookieParser(config.cookieSecret));

app.use(session({
   secret : config.cookieSecret,
   name : 'sessionId',
  })
);

app.disable('x-powered-by');
app.set('trust proxy', 1);

// STATIC FILE ROUTES
app.use('/assets', serveStatic(__dirname + '/../client/assets'));
app.use('/assets/lib', serveStatic(__dirname + '/../client/assets/bower_components'));
app.use('/app', serveStatic(__dirname + '/../client/app'));


// DEFAULT ROUTE
function defaultRoute(req, res) {
  res.sendFile(path.resolve(__dirname +'/../client/index.html'));
}

function checkLogin(req, res, next) {
  if(!config.ldap || !config.ldap.enabled) {
    return next('route');
  }

  var isLoggedin = false;

  if(req.signedCookies && req.signedCookies['auth']) {
    isLoggedin = true;
  }

  if(!isLoggedin){
    if(req.xhr) {
      var data = {
        error: 'Login required',
        success: false
      };

      return res.json(data);
    }
    return res.sendFile(path.resolve(__dirname +'/../client/login.html'));
  } else {
    return next('route');
  }
}

// API - HEALTH CHECK
app.get   ('/api/online', function(req, res){ return res.send(200); });

// API - LOGIN ROUTES
app.post  ('/api/login', controllers.auth.login);

//ALL ROUTES PAST HERE REQUIRE LOGIN
app.all   ('*', checkLogin);

// APP ROUTES
app.get   ('/',  defaultRoute);
app.get   ('/app/*', defaultRoute);

// API - CLIENT SIDE CONFIG
app.get('/config', function(req, res) {
  res
    .type('json')
    .send('window.appConfig = ' + JSON.stringify(config.client));
});

// API - REGION ROUTES
app.get   ('/api/regions', controllers.regions.list);
app.get   ('/api/regions/:regionId', controllers.regions.get);
app.post  ('/api/regions', controllers.regions.create);
app.put   ('/api/regions/:regionId', controllers.regions.update);
app.delete('/api/regions/:regionId', controllers.regions.del);
app.get   ('/api/regions/:regionId/branches', controllers.browse.branches);
app.get   ('/api/regions/:regionId/branches/:branch/builds', controllers.browse.builds);
app.get   ('/api/regions/:regionId/branches/:branch/files', controllers.browse.files);

// API - CONFIG ROUTES
app.post  ('/api/configs', controllers.configs.create);
app.put   ('/api/configs/:configId', controllers.configs.update);
app.delete('/api/configs/:configId', controllers.configs.del);

// API - REGION ENVIRONMENT ROUTES
app.get   ('/api/regions/:regionId/envs', controllers.regionenvs.list);
app.post  ('/api/regions/:regionId/envs/:envId', controllers.regionenvs.add);
app.delete('/api/regions/:regionId/envs/:envId', controllers.regionenvs.remove);


// API - ENVIRONMENT ROUTES
app.get   ('/api/envs', controllers.envs.list);
app.post  ('/api/envs', controllers.envs.create);
app.get   ('/api/envs/:envId', controllers.envs.get);
app.put   ('/api/envs/:envId', controllers.envs.update);
app.delete('/api/envs/:envId', controllers.envs.remove);
app.put   ('/api/envs/:envId/start', controllers.envs.start);
app.put   ('/api/envs/:envId/pause', controllers.envs.pause);
app.put   ('/api/envs/:envId/redeploy', controllers.envs.redeploy);
app.put   ('/api/envs/:envId/reset', controllers.envs.reset);
app.get   ('/api/envs/:envId/configs', controllers.configs.findByEnv);
app.get   ('/api/envs/:envId/branches/:branch/launchKeys', controllers.configs.launchKeys);
app.get   ('/api/envs/:envId/branches/:branch/litKeys', controllers.configs.litKeys);
app.put   ('/api/envs/sendLaunchKeys', controllers.configs.sendLaunchKeys);


// API - TASK ROUTES
app.get ('/api/jobs', controllers.jobs.list);
app.get ('/api/jobs/:jobId', controllers.jobs.get);


// API - SKYTAP PROXY ROUTES
app.get ('/api/skytap/environments', controllers.skytap.environments);
app.get ('/api/skytap/environments/:configuration_id', controllers.skytap.environment);

// API - TASKS
app.get ('/api/tasks', controllers.tasks.list);

// CONVERT TO UNIVERSAL HANDLER
app.all ('/api/*', function(req, res) {

  if(res.result) {

    // apply paging headers
    if(res.result.total) {
      res.set('X-Paging-Total', res.result.total);
      res.set('X-Paging-Page', res.result.page);
      res.set('X-Paging-PageSize', res.result.pagesize);
      res.set('X-Paging-LastPage', Math.ceil(res.result.total / res.result.pagesize));
    }

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


var set = migrate.load('migrations/.migrate', 'migrations');
set.up(function (err) {
  if (err) {
    console.error("failed to migrate db");
    throw err;
  }
  console.log("DB Tasks Completed");
  
  if(config.host) {
    app.listen(config.port, config.host, function() {
      debug('Listening on %s:%d ', (config.host ? config.host : '*'), config.port);
    });
  } else {
    app.listen(config.port, function() {
      debug('Listening on %s:%d ', (config.host ? config.host : '*'), config.port);
    });
  }
});

// OVERWRITE DEFAULT DEBUG
var debugapp = require('debug');
var util = require('util');
var fs = require('fs');

debugapp.log = function() {
  // taken from node.js inside debug library
  var text = util.format.apply(this, arguments);

  // log to console and file
  console.log(text);
  fs.appendFileSync('access.log', text + '\n');
};
