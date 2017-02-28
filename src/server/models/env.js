var Model       = require('hops-model')
  , schema
  , Environment
  ;

/* eslint-disable */
schema = {
  "properties": [
    { "name": "envId" },
    { "name": "created" },
    { "name": "updated" },
    { "name": "envName", "required": true },
    { "name": "envDesc" },
    { "name": "host" },
    { "name": "status", "required": true, "default": "deployed" },
    { "name": "remoteType", "required": true },
    { "name": "remoteId" },
    { "name": "config" },
    { "name": "deployedBy" },
    { "name": "deployedOn" },
    { "name": "deployedUntil" },
    { "name": "deployedNotes" },
    { "name": "deployedBranch" },
    { "name": "deployedJobId" },
    { "name": "runstate" },
    { "name": "machines" },
    { "name": "updatePath" },
    { "name": "newLaunchKeys" },
    { "name": "swarmhost" },
  ]
};
/* eslint-enable */


Environment = Model.extend(schema);
module.exports = Environment;