var Model       = require('hops-model')
  , schema
  , Machine
  ;

/* eslint-disable */
schema = {
  "properties": [
    { "name": "regionId" },
    { "name": "regionName", "required": true },
    { "name": "regionDesc" },
    { "name": "serviceConfig" },
    { "name": "browseConfig" },
    { "name": "runasUser"},
    { "name": "runasPassword"}
  ]
};
/* eslint-enable */


Machine = Model.extend(schema);
module.exports = Machine;