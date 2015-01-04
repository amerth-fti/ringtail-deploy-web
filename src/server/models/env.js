var Model       = require('hops-model')
  , schema
  , Environment
  ;

/* jshint es5:false */
/* jshint ignore:start */
schema = {
  "properties": [
    { "name": "envId" },
    { "name": "created" },
    { "name": "updated" },
    { "name": "envName", "required": true },
    { "name": "envDesc" },
    { "name": "status", "required": true, "default": "deployed" }, 
    { "name": "remoteType", "required": true },
    { "name": "remoteId" },
    { "name": "config" },
    { "name": "deployedBy" },
    { "name": "deployedOn" },
    { "name": "deployedUntil" },
    { "name": "deployedNotes" },
    { "name": "deployedBranch" },    
    { "name": "runstate" },
    { "name": "machines" }
  ]
};
/* jshint ignore:end */


Environment = Model.extend(schema);
module.exports = Environment;

Environment.prototype.readConfig = function readConfig() {
  try {
    return JSON.parse(this.config);
  }
  catch(ex) {
    return {};
  }
};