var Model       = require('hops-model')
  , schema
  , Config
  ;

/* eslint-disable */
schema = {
  "properties": [
    { "name": "configId" },
    { "name": "configName" },
    { "name": "data", type: "json" },
    { "name": "launchKey", type: "json" },
    { "name": "roles", type: "array" },
    { "name": "envId" }
  ]
};
/* eslint-enable */


Config = Model.extend(schema);
module.exports = Config;