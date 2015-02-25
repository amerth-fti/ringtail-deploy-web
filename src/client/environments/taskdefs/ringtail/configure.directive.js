(function() {
  'use strict';

  angular
    .module('app.environments.taskdefs.ringtail')
    .directive('taskdefRingtail', taskdefRingtail);

  function taskdefRingtail() {
    return { 
      restrict: 'E',
      scope: {
        environment: '=',
        taskdef: '='   
      },
      templateUrl: '/app/environments/taskdefs/ringtail/configure.html',
      controller: TaskdefRingtailController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  TaskdefRingtailController.$inject = [ 'RingtailConfig', 'Role' ];

  function TaskdefRingtailController(RingtailConfig, Role) {
    var vm          = this; 
    vm.environment  = this.environment;
    vm.taskdef      = this.taskdef;    
    vm.roles        = null;
    vm.roleconfigs  = null;
    vm.selectedRole = 0;
    vm.selectRole   = selectRole;

    activate();

    //////////

    function activate() {
      vm.roles = Role.environment(vm.environment);
      vm.roleconfigs = RingtailConfig.get(vm.roles[vm.selectedRole]);
    }

    function selectRole(index, role) {
      vm.selectedRole = index;      
    }
  }

}());

