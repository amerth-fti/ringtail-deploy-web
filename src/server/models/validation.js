var Model       = require('hops-model')
  , schema
  , Validation
  ;

/* eslint-disable */
schema = {
  "properties": [
    { "name": "jobId" },
    { "name": "log" }
  ]
};
/* eslint-enable */


Validation = Model.extend(schema);
module.exports = Validation;