var migrations = require('./migrations')
  ;

exports.up = function(next){    
  migrations.runBlock('006-addRegionConfigs', next);  
};

exports.down = function(next){  
  migrations.runBlock('006-dropRegionConfigs', next);  
};


