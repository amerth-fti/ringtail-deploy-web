(function() {
  'use strict';

  angular
    .module('shared')
    .factory('taskdefFactory', taskdefFactory);

  taskdefFactory.$inject = [ '_' ];
 
  function taskdefFactory(_) {
    return {
      create: create
    };

    function create(environment) {
      return { 
        'taskdefs': [ createEnvironment(environment) ]
      };
    }

    function createEnvironment(environment) {
      var taskdef
        , subtasks;

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

      subtasks.forEach(function(subtask, index) {
        if(!subtask) {
          subtasks.splice(index, 1);
        }
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
          'name': machine.machineName || 'Machine ' + index,
          'data': {
            'machine': 'scope.me.machines[' + index + ']',
            'branch': 'scope.me.deployedBranch',
            'config': {
              'ROLE': machine.role,
              'Common|RINGTAILUISTATICCONTENTURL': baseUrl + '/UIStatic',
              'Common|RINGTAILSTSURL': baseUrl + '/RingtailSTS',
              'Common|RINGTAILIISWEBAPPLICATIONURL': baseUrl + '/ringtail',
              'Common|RINGTAILHELPURL': baseUrl + '/RingtailHelp',
              'Common|RINGTAILCLASSICURL': baseUrl + '/classic',
              'Common|RINGTAILLEGALURL': baseUrl + '/RTLC',
              'Common|RMCIISWEBAPPLICATIONURL': baseUrl + '/RMC'
            }
          }
        }
      };

      return taskdef;
    }  

    

    function getEnvironmentTaskDefs(environment) {
      var config = environment.config || { 'taskdefs': [] };
      return config.taskdefs || [];
    } 

    function findInstallTaskDefs(taskdefs) {
      var install = _.where(taskdefs, { 'task': '3-custom-ringtail' });
      if(install.length === 0) {
        install = _.where(taskdefs, { 'task': 'parallel' });
      }
    }

    function findRoleTaskDefs(taskdefs, role) {
      return _.filter(taskdefs, function(taskdef) {
        return taskdef.data.config.ROLE === role;
      });
    }

  }

}());