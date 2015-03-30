var Q           = require('q')
  , chalk       = require('chalk')
  , statements  = require('statements')
  , Sqlite      = require('hops-sqlite')
  , sqlPath     = __dirname + '/migrations.sql'
  , dbPath      = __dirname + '/../data/deployer.db'
  , sql         = statements.read(sqlPath)
  ;


exports.runBlock = function runBlock(blockName, next) {      
  var db            = new Sqlite(dbPath) 
    , sqlBlock      = sql[blockName]
    , sqlCommands   = sqlBlock.split(';')
    , funcs;

  funcs = sqlCommands
    .filter(function(cmd) {
      return !!cmd && cmd !== '';
    })
    .map(function(cmd) {   
      cmd = cmd + ';'; 
      cmd = cmd.replace(/^\s*/,'');

      return function() {  
        console.log('    %s: \'%s\'', chalk.yellow('run'), chalk.gray(cmd.replace('\n', ' ').substring(0, 50)));      
        return db.run(cmd);      
      };    
    });

  /* jshint es5: false */
  /* jshint newcap: false */
  funcs.reduce(Q.when, Q())
  .then(function() { next(); })
  .done();
  /* jshint newcap: true */
};