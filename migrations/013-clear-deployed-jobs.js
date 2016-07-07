var migrations  = require('./migrations');

exports.up = function(next){
  migrations.runBlock('013-clearDeployedJobs', next);
};

exports.down = function(next) {
  next();
};
