var Model       = require('hops-model')
  , schema
  , Job
  ;

/* eslint-disable */
schema = {
  "properties": [
    { "name": "jobId" },
    { "name": "log" }
  ]
};
/* eslint-enable */


Job = Model.extend(schema);
module.exports = Job;