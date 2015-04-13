var crypto      = require('crypto')
  , migrations  = require('./migrations')
  , envService  = require('../src/server/services/env-service')  
  , configSvc   = require('../src/server/services/config-service')
  ;

exports.up = function(next){    
  migrations.runBlock('007-createConfigs', next);
  migrateConfigs();
};

exports.down = function(next) {
  migrations.runBlock('007-dropConfigs', next);
};



function migrateConfigs() {
  envService.findAll()
  .then(processEnvs);
}

function processEnvs(envs) {
  envs.forEach(function(env) {

    var configs = []
      , installTasks = getInstallTaskDefs(env)
      ;

    // handle single machine
    if(env.machines.length === 1 && hasTaskDefs(env)) {                  
      var machineTask = findTaskDefForMachineIndex(installTasks, 0);
      var machine = env.machines[0];
      if(machineTask) {
        configs[0] = { 
          configId: null, 
          data: machineTask.options.data.config, 
          roles: [ machine.role ] 
        };
        configs[0].configId = createHashId(configs[0]);
      }
    }
    // handle multiple machines
    else if(env.machines.length > 1) {

    }     

    // create the configs

  });
}

function hasTaskDefs(env) {
  return env.config && env.config.taskdefs;
}

// Give a list of taskdefs
// This will pluck out all of the installation taskdefs
function getInstallTaskDefs(taskdefs) {
  var results = [];
  taskdefs.forEach(function(taskdef) {
    if(taskdef.task === '3-ringtail-taskdef') {
      results.push(taskdef);
    } else if(taskdef.task === 'parallel') {
      taskdef.options.taskdefs.forEach(function(subtaskdef) {
        if(subtaskdef.task === '3-ringtail-taskdef') {
          results.push(subtaskdef);
        }
      });
    }
  });
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
function createHashId(config) {
  var str = JSON.stringify(config.data);
  return crypto.md5(str);
}


// TODO
// Remove the configs from the 3-ringtail-install taskdefs
function removeConfigFromTaskDefs() {

}