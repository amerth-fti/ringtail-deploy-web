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

    function create(environment) {
      var taskdefs = [];

      taskdefs.push({
        'task': '3-install-many',
        'options': {
          'name': 'Install Ringtail',
          'installs': 'all'
        }
      });

      return {
        'taskdefs': taskdefs
      };
    }

    function addTask(environment) {
      var taskdef = {
        'task': '3-install-many',
        'options': {
          'name': 'Install Ringtail',
          'installs': 'all'
        }
      };
      environment.config.taskdefs.push(taskdef);
    }
  }

}());