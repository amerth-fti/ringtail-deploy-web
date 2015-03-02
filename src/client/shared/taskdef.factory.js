(function() {
  'use strict';

  angular
    .module('shared')
    .factory('TaskDef', TaskDef);

  TaskDef.$inject = [ '_' ];
 
  function TaskDef(_) {
    return {
      create: create,      
      getEnvTaskDefs: getEnvTaskDefs,
      getEnvTaskDefForRole: getEnvTaskDefForRole,
      getKeyValuePairs: getKeyValuePairs,

      /* Private - open for testing */
      findInstallTaskDefs: findInstallTaskDefs,
      findTaskDefForRole: findTaskDefForRole,      
    };

    function create(environment) {
      return { 
        'taskdefs': [ createEnvironment(environment) ]
      };
    }

    function createEnvironment(environment) {
      var taskdef
        , subtasks
        ;

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
              'ROLE': machine.role              
            }
          }
        }
      };

      return taskdef;
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
        return taskdef.options.data.config.ROLE === role;
      });
      return matches[0] || null;
    }

    function getKeyValuePairs(taskdef) {
      return taskdef.options.data.config;      
    }
  }

}());