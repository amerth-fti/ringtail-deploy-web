var migrations  = require('./migrations');

exports.up = function(next){
  migrations.runBlock('011-addUpdatePathToEnv', next);
};

exports.down = function(next) {
  next();
};
