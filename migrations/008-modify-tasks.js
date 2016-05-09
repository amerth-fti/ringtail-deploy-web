var crypto      = require('crypto')
  , util        = require('util')
  , q           = require('q')
  , migrations  = require('./migrations')
  , Config      = require('../src/server/models/config')
  ;

exports.up = function(next){
  migrations.runBlock('008-modifyTasks', function(err) {
    if(err) next(err);
    else migrateTasks(function(err) {
      if(err) {
        console.log(err);
        console.log(err.stack);
        next(err);
      }
      else {
        next();
      }
    });
  });
};

exports.down = function(next) {
  migrations.runBlock('008-modifyTasks', next);
};


function migrateTasks(next) {
  var envService  = require('../src/server/services/env-service');
  return envService
    .findAll({ pagesize: 1000 })
    .then(processEnvs)
    .then(function() {
      migrations.log('tasks', 'task migration is complete');
    })
    .nodeify(next);
}

function processEnvs(envs) {
  var envService  = require('../src/server/services/env-service');

  // process each environment
  var promises = envs.map(function(env) {
    return function() {
      var i
        , index
        , found
        ;

      // interrogate the config for parallel or 3-ringtail-install
      if(env.config && env.config.taskdefs) {
        for(i = 0; i < env.config.taskdefs.length; i += 1) {


          if(env.config.taskdefs[i].task === '3-custom-ringtail' ||
             env.config.taskdefs[i].task === 'parallel') {
            index = i;
            found = true;
            break;
          }
        }
      }

      if(!found) {
        migrations.log('tasks', util.format('env %s skipped, no install task found', env.envId));
      }
      else {
        env.config.taskdefs[index] = {
          'task': '3-install-many',
          'options': {
            'name': 'Install Ringtail',
            'installs': 'all'
          }
        };
        return envService.update(env)
          .then(function() {
            migrations.log('tasks', util.format('env %s install task migrated', env.envId));
          })
          .catch(function(ex) {
            migrations.log('tasks', ex);
          });
      }

    };

  });

  return promises.reduce(q.when, promises, q());
}
