var migrations = require('./migrations')
  ;

exports.up = function(next){    
  migrations.runBlock('004-createRegion', next);  
};

exports.down = function(next){  
  migrations.runBlock('004-dropRegion', next);  
};
