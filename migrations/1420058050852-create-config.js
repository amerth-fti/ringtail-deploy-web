var statements  = require('statements')
  , Sqlite      = require('hops-sqlite')
  , db
  , sql
  ;

sql = statements.read(__dirname + '/sql/migrations.sql');
db  = new Sqlite(__dirname + '/../deployer.db');

exports.up = function(next){
  db  
    .run(sql.createConfig)
    .then(function() { next(); })
    .done();
};

exports.down = function(next){
  db
    .run(sql.dropConfig)
    .fin(function() { next(); });
};
