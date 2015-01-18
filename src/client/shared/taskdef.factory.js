(function() {
  'use strict';

  angular
    .module('shared')
    .factory('taskdefFactory', taskdefFactory);

  taskdefFactory.$inject = [ ];
 
  function taskdefFactory() {
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
        'name': 'parallel',
        'taskdefs': null
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

      taskdef.taskdefs = subtasks;

      return taskdef;
    }

    function createMachine(environment, machine, index) {
      var baseUrl
        , taskdef;

      baseUrl = 'http://' + environment.host;
      taskdef = {
        'name': '3-ringtail',
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
      };

      return taskdef;
    }

  }

}());