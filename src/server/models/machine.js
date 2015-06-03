var Model       = require('hops-model')
  , schema
  , Machine
  ;

/* jshint es5:false */
/* jshint ignore:start */
schema = {
  "properties": [
    { "name": "machineId" },
    { "name": "envId" },
    { "name": "created" },
    { "name": "updated" },
    { "name": "machineName", "required": true },
    { "name": "machineDesc" }, 
    { "name": "remoteId" },
    { "name": "intIP" },
    { "name": "extIP" },
    { "name": "role" },
    { "name": "installNotes" },
    { "name": "registryNotes" },
    { "name": "configId" }
  ]
};
/* jshint ignore:end */


Machine = Model.extend(schema);
module.exports = Machine;