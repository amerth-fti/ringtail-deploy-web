(function() {
  'use strict';

  angular
    .module('app.environments.taskdefs')
    .service('TaskDef', TaskDef);

  TaskDef.$inject = [ '_' ];

  function TaskDef(_) {
    return {
      create: create,
      addTask: addTask
    };

    function create() {
      return {
        'taskdefs': [ createDefaultTaskDef() ]
      };
    }

    function addTask(environment) {
      var newTaskDef = createDefaultTaskDef();
      environment.config.taskdefs.push(newTaskDef);
    }

    function createDefaultTaskDef() {
      return {
        'task': '3-install-many',
        'options': {
          'name': 'Install Ringtail',
          'installs': 'all'
        }
      };
    }
  }

}());