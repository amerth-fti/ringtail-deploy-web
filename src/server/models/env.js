var Model       = require('sweetener-model')
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
    { "name": "remoteType", "required": true },
    { "name": "remoteId" },
    { "name": "configId" },
    { "name": "deployedBy" },
    { "name": "deployedOn" },
    { "name": "deployedUntil" },
    { "name": "deployedNotes" },
    { "name": "deployedBranch" }
  ]
};
/* jshint ignore:end */


Environment = Model.extend(schema);
module.exports = Environment;