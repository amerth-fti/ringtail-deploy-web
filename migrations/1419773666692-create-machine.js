var statements  = require('statements')
  , Sqlite      = require('hops-sqlite')
  , db
  , sql
  ;

sql = statements.read(__dirname + '/migrations.sql');
db  = new Sqlite(__dirname + '/../data/deployer.db');

exports.up = function(next){
  db  
    .run(sql.createMachine)
    .then(function() { next(); })
    .done();
};

exports.down = function(next){
  db
    .run(sql.dropMachine)
    .fin(function() { next(); });
};
