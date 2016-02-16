var Model       = require('hops-model')
  , schema
  , Config
  ;

/* jshint es5:false */
/* jshint ignore:start */
schema = {
  "properties": [
    { "name": "configId" },
    { "name": "configName" },
    { "name": "data", type: "json" },
    { "name": "roles", type: "array" },
    { "name": "envId" }
  ]
};
/* jshint ignore:end */


Config = Model.extend(schema);
module.exports = Config;