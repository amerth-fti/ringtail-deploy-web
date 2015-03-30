var migrations = require('./migrations')
  ;

exports.up = function(next){    
  migrations.runBlock('003-createMachine', next);  
};

exports.down = function(next){  
  migrations.runBlock('003-dropMachine', next);  
};

