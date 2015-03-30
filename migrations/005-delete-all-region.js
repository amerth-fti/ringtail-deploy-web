var migrations = require('./migrations')
  ;

exports.up = function(next){    
  migrations.runBlock('005-deleteDefaultRegion', next);  
};

exports.down = function(next){  
  migrations.runBlock('005-addDefaultRegion', next);  
};
