var crypto      = require('crypto')
  , util        = require('util')
  , q           = require('q')
  , migrations  = require('./migrations')
  , Config      = require('../src/server/models/config')
  ;

exports.up = function(next){
  migrations.runBlock('007-createConfigs', function(err) {
    if(err) next(err);
    else migrateConfigs(function(err) {
      if(err) {
        console.log(err);
        console.log(err.stack);
      } else {
        migrations.log('config', 'Completed');
      }
      next(err);
    });
  });
};

exports.down = function(next) {
  migrations.runBlock('007-dropConfigs', next);
};



function migrateConfigs(next) {
  var envService  = require('../src/server/services/env-service');
  return envService
    .findAll({ pagesize: 1000 })
    .then(processEnvs)
    .nodeify(next);
}

function processEnvs(envs) {
  var configSvc   = require('../src/server/services/config-service')
    , machineSvc  = require('../src/server/services/machine-service');

  // process each environment
  var promises = envs.map(function(env) {
    return function() {

      // find the install definition
      var installTasks = getInstallTasks(env);

      // we can only operate if we have a install task
      // if none is defined, or if more than one, we abort
      if(installTasks.length === 0) {
        migrations.log('config', util.format('env %s skipped, no install tasks', env.envId));
        return q(0);
      }

      // process each machine by creating a new config
      // and attaching the config to the machine
      function processEnv(machine, machineIndex) {
        var machineTask
          , taskConfig
          , config
          ;

        // retrieve the config for this guy
        machineTask = findInstallTaskForMachine(installTasks, machineIndex);
        if(!machineTask) {
          migrations.log('config', util.format('env %s, machine %s skipped, no install task for machine', env.envId, machine.machineId));
          return q(0);
        }

        taskConfig = machineTask.options.data.config;

        // create the config
        config = new Config({
          configName: env.envName + ' - ' + machine.machineName,
          data: taskConfig,
          roles: [ machine.role ]
        });

        return configSvc
          .create(config)
          .then(function(config) {
            machine.configId = config.configId;
            return machineSvc.update(machine);
          })
          .then(function() {
            migrations.log('config', util.format('env %s, machine %s updated', env.envId, machine.machineId));
            return q(1);
          })
          .catch(function(err) {
            console.log(err.stack);
            migrations.log('config', util.format('env %s, machine %s failed', env.envId, machine.machineId));
            return q(0);
          });
      }

      var promises = env.machines.map(function(machine, index) {
        return function() {
          return processEnv(machine, index);
        };
      });
      return promises.reduce(q.when, promises, q());

    };

  });

  return promises.reduce(q.when, promises, q());
}

// Give a list of taskdefs
// This will pluck out all of the installation taskdefs
function getInstallTasks(env) {
  var results = []
    , taskdefs
    ;
  if(env.config && env.config.taskdefs) {
    taskdefs = env.config.taskdefs;
    taskdefs.forEach(function(taskdef) {
      // handle ringail task
      if(taskdef.task === '3-custom-ringtail') {
        results.push(taskdef);
      }
      // handle parallel
      else if(taskdef.task === 'parallel') {
        taskdef.options.taskdefs.forEach(function(subtaskdef) {
          if(subtaskdef && subtaskdef.task === '3-custom-ringtail') {
            results.push(subtaskdef);
          }
        });
      }
    });
  }
  return results;
}

// Given a list of installation TaskDefs
// This methods will find the one that maps to the supplied
// machine index
function findInstallTaskForMachine(installtasks, idx) {
  var result = null;
  installtasks.forEach(function(task) {
    if(task.options.data.machine === 'scope.me.machines[' + idx + ']') {
      result = task;
    }
  });
  return result;
}