(function() {
  'use strict';

  angular
    .module('app.environments.taskdefs')
    .service('TaskDef', TaskDef);

  TaskDef.$inject = [ '_' ];
 
  function TaskDef(_) {
    return {
      create: create,      
      getEnvTaskDefs: getEnvTaskDefs,
      getEnvTaskDefForRole: getEnvTaskDefForRole,
      getKeyValuePairs: getKeyValuePairs,
      addTask: addTask,

      /* Private - open for testing */
      findInstallTaskDefs: findInstallTaskDefs,
      findTaskDefForRole: findTaskDefForRole,      
    };

    function create(environment) {
      var taskdefs = []
        , envTaskdef = createEnvironment(environment)
        ;

      if(envTaskdef) {
        taskdefs.push(envTaskdef);
      }

      return { 
        'taskdefs': taskdefs
      };
    }

    function createEnvironment(environment) {
      var taskdef
        , subtasks
        ;

      if(environment.machines) {

        taskdef = {
          'task': 'parallel',
          'options': {
            'name': 'Install Ringtail',
            'taskdefs': null
          }       
        };

        subtasks = environment.machines.map(function(machine, index) {
          if(machine.role) {
            return createMachine(environment, machine, index);
          }
        });

        subtasks = _.filter(subtasks, function(subtask) {
          return !!subtask;
        });

        taskdef.options.taskdefs = subtasks;

      }
      return taskdef;
    }

    function createMachine(environment, machine, index) {
      var baseUrl
        , taskdef;

      taskdef = {
        'task': '3-custom-ringtail',
        'options': {
          'name': 'Install ' + (machine.machineName || 'Machine ') + index,
          'data': {
            'machine': 'scope.me.machines[' + index + ']',
            'branch': 'scope.me.deployedBranch',
            'config': {
              'RoleResolver|ROLE': machine.role
            }
          }
        }
      };

      return taskdef;
    }

    function addTask(environment) {
      var taskdef = {
        'task': '1-wait',
        'options': {
          'name': 'New task',
          'data': { }
        }
      };
      environment.config.taskdefs.push(taskdef);
    }

    function getEnvTaskDefForRole(environment, role) {
      var taskdefs = getEnvTaskDefs(environment);
      taskdefs = findInstallTaskDefs(taskdefs);
      return findTaskDefForRole(taskdefs, role);
    }

    function getEnvTaskDefs(environment) {
      var config = environment.config || create(environment);
      return config.taskdefs;
    }  

    function findInstallTaskDefs(taskdefs) {
      var result = [];

      function processTaskDef(taskdef) {
        if(taskdef.task === '3-custom-ringtail') {
          processInstall(taskdef);
        }
        else if (taskdef.task === 'parallel') {
          processParallel(taskdef);
        }
      }

      function processInstall(taskdef) {
        result.push(taskdef);
      }

      function processParallel(taskdef) {
        if(taskdef.options && taskdef.options.taskdefs && Array.isArray(taskdef.options.taskdefs)) {
          var taskdefs = taskdef.options.taskdefs;
          taskdefs.forEach(processTaskDef);          
        }
      }
      
      taskdefs.forEach(processTaskDef);    
      return result;
    }

    function findTaskDefForRole(taskdefs, role) {
      var matches = _.filter(taskdefs, function(taskdef) {
        return taskdef.options && 
               taskdef.options.data && 
               taskdef.options.data.config &&
               (taskdef.options.data.config.ROLE === role ||
               taskdef.options.data.config['RoleResolver|ROLE'] === role);
      });
      return matches[0] || null;
    }

    function getKeyValuePairs(taskdef) {
      return taskdef.options.data.config;      
    }
  }

}());