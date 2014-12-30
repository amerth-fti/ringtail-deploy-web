var statements  = require('statements')
  , Sqlite      = require('sweetener-sqlite')
  , db
  , sql
  ;

sql = statements.read(__dirname + '/sql/migrations.sql');
db  = new Sqlite(__dirname + '/../deployer.db');

exports.up = function(next){
  db  
    .run(sql.createVM)
    .then(function() { next(); })
    .done();
};

exports.down = function(next){
  db
    .run(sql.dropVM)
    .then(function() { next(); })
    .done();
};
