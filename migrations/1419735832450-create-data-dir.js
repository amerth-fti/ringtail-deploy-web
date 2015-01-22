var fs = require('fs')
  , path = __dirname + '/../data/'
  , dbpath = path + 'deployer.db'
  ;

exports.up = function(next){
  fs.mkdir(path, function(err) {
    next();
  });
};

exports.down = function(next){
  next();
};
