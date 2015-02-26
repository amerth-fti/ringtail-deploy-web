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

  TaskdefRingtailController.$inject = [ '_', 'RingtailConfig', 'Role', 'RingtailField' ];

  function TaskdefRingtailController(_, RingtailConfig, Role, RingtailField) {
    var vm          = this; 
    vm.environment  = this.environment;
    vm.taskdef      = this.taskdef;    
    vm.fields       = null;
    vm.roles        = null;
    vm.selectedRole = null;
    vm.selectRole   = selectRole;    

    activate();

    //////////

    function activate() {
      vm.roles = Role.environment(vm.environment);
      selectRole(0, vm.roles[0]);
    }

    function selectRole(index, role) {
      vm.selectedRole = index;       
      RingtailConfig
        .get(role)
        .success(processConfigs);
    }

    function processConfigs(kvps) {    
      var keys = _.pluck(kvps, 'key');
      vm.fields = keys.map(function(key) {
        var field = RingtailField.getField(key);
        field.value = field.default;
        return field;
      });
    }
  }

}());

