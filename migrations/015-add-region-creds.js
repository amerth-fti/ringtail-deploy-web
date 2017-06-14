var migrations  = require('./migrations');

exports.up = function(next){
  migrations.runBlock('015-addRegionCreds', next);
};

exports.down = function(next) {
  next();
};
