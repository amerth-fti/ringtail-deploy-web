(function() {
  'use strict';

  angular
    .module('app.environments.taskdefs.raw')
    .directive('taskdefRaw', taskdefRaw);

  function taskdefRaw() {
    return { 
      restrict: 'E',
      scope: {
        environment: '=',
        taskdef: '='
      },
      templateUrl: '/app/environments/taskdefs/raw/editor.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ 'Task', '_' ];

  function Controller(Task, _) {
    var vm              = this;
    vm.environment      = this.environment;    
    vm.taskdef          = this.taskdef;
    vm.dataJson         = null;    
    vm.invalid          = false;
    vm.tasktypes        = null;
    vm.selectedTasktype = null;
    vm.jsonChanged      = jsonChanged;
    vm.tasktypeChanged  = tasktypeChanged;

    activate();

    //////////

    function activate() { 
      var data = vm.taskdef.options.data || {}; 
      vm.dataJson = JSON.stringify(data, null, 2);

      Task
        .query(function(tasks) {
          vm.tasktypes = tasks;
          vm.selectedTasktype = findCurrentTasktype();
          tasktypeChanged();
        });
    }

    function findCurrentTasktype() {
      var name = vm.taskdef.task
        , result
        ;
      result = _.find(vm.tasktypes, function(tasktype) {
        return tasktype.name === name;
      });
      return result;
    }

    function tasktypeChanged() {
      var data = vm.taskdef.options.data || {}
        , tasktype = vm.selectedTasktype
        ;

      tasktype.data.forEach(function(key) {
        if(!data[key]) {
          data[key] = null;
        }
      });
      vm.dataJson = JSON.stringify(data, null, 2);
      vm.taskdef.task = vm.selectedTasktype.name;
    }

    function jsonChanged() {
      try 
      {
        var temp = JSON.parse(vm.dataJson);
        vm.taskdef.options.data = temp;
        vm.invalid = false;
      }
      catch(ex) {
        vm.invalid = true;
      }
    }

  }

}());

