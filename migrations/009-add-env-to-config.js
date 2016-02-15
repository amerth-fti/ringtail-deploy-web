var migrations  = require('./migrations');

exports.up = function(next){
  migrations.runBlock('009-addEnvToConfig', next);
};

exports.down = function(next) {
  migrations.runBlock('009-dropEnvToConfig', next);
};
