var debug           = require('debug')('deployer-environments')
  , Q               = require('q')
  , envService      = require('../services/env-service')
  , redeployService = require('../services/redeploy-service')
  ;


exports.list = function list(req, res, next) {
  debug('listing environments');
  envService
    .findAll(null, function(err, result) {
      res.result = result;
      res.err = err;
      next();
    });
};


exports.get = function get(req, res, next) {
  var envId = req.params.envId;
  debug('getting environment - findById %s', req.params.envId);
  envService
    .findById(envId, function(err, result) {
      res.result  = result;
      res.err     = err;
      next();
    });
};

exports.version = function get(req, res, next) {
  var envId = req.params.envId;
  debug('getting environment - version %s', req.params.envId);
  envService
    .version(envId, function(err, result) {
      res.result  = result;
      res.err     = err;
      next();
    });
};


exports.create = function create(req, res, next) {
  debug('creating environment');
  var data = req.body;
  envService
    .create(data, function(err, result) {
      res.result = result;
      res.err = err;
      next();
    });
};

exports.update = function update(req, res, next) {
  debug('updating environments');
  var data = req.body;
  envService
    .update(data, function(err, result) {
      res.result = result;
      res.err = err;
      next();
    });
};

exports.remove = function remove(req, res, next) {
  var envId = req.params.envId;
  debug('removing environment %s', req.params.envId);
  envService
    .remove(envId, function(err) {
      res.result = {};
      res.err = err;
      next();
    });
};

exports.start = function start(req, res, next) {
  debug('starting environment');
  var data          = req.body
    , suspendOnIdle = req.param('suspend_on_idle');

  envService
    .start(data, suspendOnIdle, function(err, result) {
      res.result = result;
      res.err = err;
      next();
    });
};

exports.pause = function pause(req, res, next) {
  debug('pausing environment');
  var data = req.body;

  envService
    .pause(data, function(err, result) {
      res.result  = result;
      res.err     = err;
      next();
    });
};


exports.redeploy = function redeploy(req, res, next) {
  debug('redeploy');
  var data = req.body
    , opts = parseQueryString(req.query)
    ;

  redeployService
    .redeploy(data, opts, function(err, result) {
      res.result = result;
      res.err = err;
      next();
    });
};

exports.quickdeploy = async function quickdeploy(req, res, next) {
  var data = {};
  data.envId = req.param('envId');
  data.branch = req.param('branch');
  debug('quickdeploy - env: ' + data.envId + ' branch: %s', data.branch);
  let response = {};
  try {
    response = await redeployService.quickRedeploy(data);
    response.success = true;
  } 
  catch (err) {
    debug('quickdeploy - error: %s', err);
    response = { message: err };
    response.success = false;
  }
  return res.json(response);
};


exports.reset = function reset(req, res, next) {
  debug('reset');
  var envId = req.param('envId');

  envService
    .reset(envId, function(err, result) {
      res.result = result;
      res.err = err;
      next();
    });
};


/*
 * Default functionality returns strings for the
 * values. There don't appear to any good middleware modules
 * for parsing the values... so here we go
 */
function parseQueryString(qs) {
  var result = {};
  for(var key in qs) {
    // parse numbers or boolean values
    if(typeof(qs[key]) === 'string' && /^\d+$|^false$|^true$/.test(qs[key])) {
      result[key] = JSON.parse(qs[key]);
    }
    // use everything else
    else {
      result[key] = qs[key];
    }
  }
  return result;
}