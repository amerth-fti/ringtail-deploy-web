var migrations  = require('./migrations');

exports.up = function(next){
  migrations.runBlock('014-addSwarmHost', next);
};

exports.down = function(next) {
  next();
};
