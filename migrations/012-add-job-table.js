var migrations  = require('./migrations');

exports.up = function(next){
  migrations.runBlock('012-addJobTable', next);
};

exports.down = function(next) {
  next();
};
