var migrations = require('./migrations')
  ;

exports.up = function(next){    
  migrations.runBlock('002-createEnv', next);  
};

exports.down = function(next){  
  migrations.runBlock('002-dropEnv', next);  
};
