var crypto      = require('crypto')
  , migrations  = require('./migrations')
  , envService  = require('../src/server/services/env-service')  
  , configSvc   = require('../src/server/services/config-service')
  ;

exports.up = function(next){    
  migrations.runBlock('007-createConfigs', function(err) {
    if(err) next(err);
    else migrateConfigs(next);
  });
};

exports.down = function(next) {
  migrations.runBlock('007-dropConfigs', next);
};



function migrateConfigs(next) {
  return envService
    .findAll()
    .then(processEnvs)
    .nodeify(next);
}

function processEnvs(envs) {
  var migrations = {};

  // process each environment
  envs.forEach(function(env) {
    var installTasks = getInstallTaskDefs(env)
      , machineTask
      , machine
      , config
      , hash
      ;

    // handle single machine
    if(env.machines.length === 1) {    
      machineTask = findTaskDefForMachineIndex(installTasks, 0);
      machine = env.machines[0];

      // ensure there is an installation task
      if(machineTask) {
        hash = createHash(machineTask.options.data.config);

        // check for an existing migration
        if(migrations[hash]) {
          migrations[hash].machines.push(machine);
        } 
        // create the migration since it doesn't exist
        else {
          config = { 
            configId: null, 
            data: machineTask.options.data.config, 
            roles: [ machine.role ]
          };
          migrations[hash] = { hash: hash, config: config, machines: [ machine ] };
        }
      }
    }
    // handle multiple machines
    else if(env.machines.length > 1) {
      env.machines.forEach(function(machine, idx) {
        
      });
    }

  });  
  return migrations;
}

function hasTaskDefs(env) {
  return env.config && env.config.taskdefs;
}

// Give a list of taskdefs
// This will pluck out all of the installation taskdefs
function getInstallTaskDefs(env) {
  var results = []
    , taskdefs
    ;
  if(hasTaskDefs(env)) {
    taskdefs = env.config.taskdefs;
    taskdefs.forEach(function(taskdef) {      
      // handle ringail task
      if(taskdef.task === '3-custom-ringtail') {
        results.push(taskdef);
      } 
      // handle parallel
      else if(taskdef.task === 'parallel') {
        taskdef.options.taskdefs.forEach(function(subtaskdef) {
          if(subtaskdef.task === '3-ringtail-taskdef') {
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
function findTaskDefForMachineIndex(installtasks, idx) {
  var result = null;
  installtasks.forEach(function(task) {    
    if(task.options.data.machine === 'scope.me.machines[' + idx + ']') {      
      result = task;
    }
  }); 
  return result;
}

// Creates an MD5 hash from the given json data
function createHash(data) {
  var md5 = crypto.createHash('md5');
  var str = JSON.stringify(data);
  md5.update(str);
  return md5.digest('base64');
}


// TODO
// Remove the configs from the 3-ringtail-install taskdefs
function removeConfigFromTaskDefs() {

}