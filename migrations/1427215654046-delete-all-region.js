var Q           = require('q')
  , statements  = require('statements')
  , Sqlite      = require('hops-sqlite')
  , sqlPath     = __dirname + '/migrations.sql'
  , dbPath      = __dirname + '/../data/deployer.db'
  , down
  ;

exports.up = function(next){

  var sql = statements.read(sqlPath)
    , db  = new Sqlite(dbPath);

  Q.fcall(function() {
    return db.run(sql.deleteDefaultRegionEnvs);
  })
  .then(function() {
    return db.run(sql.deleteDefaultRegion);
  })  
  .then(function() { next(); })
  .done();
};

exports.down = function(next){

  var sql = statements.read(sqlPath)
    , db  = new Sqlite(dbPath);

  Q.fcall(function() {
    return db.run(sql.insertDefaultRegion);
  })
  .then(function() {
    return db.run(sql.insertDefaultRegionEnvs);
  })
  .then(function() { next(); })
  .done();
};
