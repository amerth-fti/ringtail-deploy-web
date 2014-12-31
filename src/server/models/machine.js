var Model       = require('hops-model')
  , schema
  , Config
  ;

/* jshint es5:false */
/* jshint ignore:start */
schema = {
  "properties": [
    { "name": "configId" },
    { "name": "created" },
    { "name": "updated" },
    { "name": "configName", "required": true },
    { "name": "configDesc" },     
    { "name": "json" }
  ]
};
/* jshint ignore:end */


Config = Model.extend(schema);
module.exports = Config;