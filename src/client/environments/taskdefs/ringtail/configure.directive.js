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
      templateUrl: '/app/environments/taskdefs/ringtail/configure.html',
      controller: TaskdefRingtailController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  TaskdefRingtailController.$inject = [ '$compile', '$scope', '$element', 'Role', 'TaskDef' ];

  function TaskdefRingtailController($compile, $scope, $element, Role, TaskDef) {
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

      element = $compile('<tasks-ringtail-field-editor role="vm.selectedRole" values="vm.currentValues"></tasks-ringtail-field-editor>')(scope);
      angular.element($element[0].querySelector('.field-editor-container')).html(element);
    }

    function updateEnvironmentConfig(values) {
      vm.environment.config.taskdefs.forEach(function(taskdef) {
        if(taskdef.task === '3-custom-ringtail') {
          if(taskdef.options.data.role === vm.selectedRole) {
            taskdef.options.data = values;
          }
        } else if (taskdef.task === 'parallel') {
          taskdef.options.taskdefs.forEach(function(taskdef) {
            if(taskdef.task === '3-custom-ringtail') {
              if(taskdef.options.data.role === vm.selectedRole) {
                taskdef.options.data = values;
              }
            }
          });
        }
      });
    }
  }

}());

