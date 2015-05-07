(function() {
  'use strict';

  angular
    .module('app.environments.taskdefs.ringtail')
    .directive('taskdefRingtail', taskdefRingtail);

  function taskdefRingtail() {
    return { 
      restrict: 'E',
      scope: {
        environment: '='        
      },
      templateUrl: '/app/environments/taskdefs/ringtail/editor.html',
      controller: TaskdefRingtailController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  TaskdefRingtailController.$inject = [ '_', '$compile', '$scope', '$element', 'Role', 'TaskDef' ];

  function TaskdefRingtailController(_, $compile, $scope, $element, Role, TaskDef) {
    var vm            = this;
    vm.environment    = this.environment;    
    vm.fields         = null;
    vm.roles          = null;
    vm.selectedRole   = null;
    vm.currentValues  = null;
    vm.selectRole     = selectRole;


    activate();

    //////////

    function activate() {
      vm.roles = Role.environment(vm.environment);      
      selectRole(0, vm.roles[0]);

      $scope.$watch('vm.currentValues', updateEnvironmentConfig, true);
    }

    function selectRole(index, role) {
      var taskdef = TaskDef.getEnvTaskDefForRole(vm.environment, role)
        , currentValues = TaskDef.getKeyValuePairs(taskdef)
        , scope = $scope.$new()
        , element
        ;

      vm.selectedRole = role;
      vm.currentValues = currentValues;

      element = $compile('<tasks-ringtail-field-editor role="vm.selectedRole" host="vm.environment.host" values="vm.currentValues"></tasks-ringtail-field-editor>')(scope);
      angular.element($element[0].querySelector('.field-editor-container')).html(element);
    }

    function updateEnvironmentConfig(values) {      
      var newValues = {};

      Object
        .keys(values)
        .sort(function(a, b) {
          return a.localeCompare(b);
        })
        .forEach(function(key) {
          newValues[key] = values[key];
        });

      vm.environment.config.taskdefs.forEach(function(taskdef) {
        // check for install task
        if(taskdef.task === '3-custom-ringtail') {
          if( taskdef.options.data && 
              taskdef.options.data.config && 
              ( taskdef.options.data.config.ROLE === vm.selectedRole ||
                taskdef.options.data.config['RoleResolver|ROLE'] === vm.selectedRole)) {
            taskdef.options.data.config = newValues;
          }
        } 
        // check parallel task
        else if (taskdef.task === 'parallel') {
          taskdef.options.taskdefs.forEach(function(taskdef) {
            if(taskdef.task === '3-custom-ringtail') {
              if( taskdef.options.data && 
                  taskdef.options.data.config && 
                  ( taskdef.options.data.config.ROLE === vm.selectedRole ||
                    taskdef.options.data.config['RoleResolver|ROLE'] === vm.selectedRole)) {
                taskdef.options.data.config = newValues;
              }
            }
          });
        }
      });
    }
  }

}());

