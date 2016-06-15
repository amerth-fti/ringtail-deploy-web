var migrations  = require('./migrations');

exports.up = function(next){
  migrations.runBlock('010-addLaunchKeyConfig', next);
};

exports.down = function(next) {
  next();
};
