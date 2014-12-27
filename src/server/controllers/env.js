var debug       = require('debug')('deployer-environments')  
  , Q           = require('q')  
  , _           = require('underscore')
  , Skytap      = require('node-skytap')
  , config      = require('../../../config')
  , Job         = require('../job')  
  , jobrunner   = require('../jobrunner')
  , taskfactory = require('../taskfactory')
  , skytap  = Skytap.init(config.skytap);



exports.list = function list(req, res) {

};