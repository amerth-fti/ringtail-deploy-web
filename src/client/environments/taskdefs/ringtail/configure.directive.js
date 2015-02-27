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

  TaskdefRingtailController.$inject = [ '_', 'RingtailConfig', 'Role', 'RingtailField' ];

  function TaskdefRingtailController(_, RingtailConfig, Role, RingtailField) {
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
    }

    function selectRole(index, role) {
      vm.selectedRole = index;       
      vm.currentValues = // LOAD FROM taskdef.factory
    }  
  }

}());

