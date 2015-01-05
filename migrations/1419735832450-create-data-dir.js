var fs = require('fs')
  , path = __dirname + '/../data/'
  ;

exports.up = function(next){
  fs.mkdir(path, function(err) {
    next();
  });
};

exports.down = function(next){
  fs.rmdir(path, function(err) {
    next();
  });
};
