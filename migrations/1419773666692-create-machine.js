var statements  = require('statements')
  , Sqlite      = require('hops-sqlite')
  , sqlPath     = __dirname + '/migrations.sql'
  , dbPath      = __dirname + '/../data/deployer.db'
  ;

exports.up = function(next){
  var sql = statements.read(sqlPath)
    , db  = new Sqlite(dbPath);

  db  
    .run(sql.createMachine)
    .then(function() { next(); })
    .done();
};

exports.down = function(next){
  var sql = statements.read(sqlPath)
    , db  = new Sqlite(dbPath);
    
  db
    .run(sql.dropMachine)
    .fin(function() { next(); });
};
