(function() {
  'use strict';

  angular
    .module('app.environments.taskdefs.ringtail')
    .directive('tasksRingtailFieldEditor', tasksRingtailFieldEditor);

  function tasksRingtailFieldEditor() {
    return { 
      restrict: 'E',
      scope: {
        role: '=',
        //host: '=',
        currentValues: '='
      },
      templateUrl: '/app/environments/taskdefs/ringtail/field-editor.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ '_', 'RingtailConfig', 'Role', 'RingtailField' ];

  function Controller(_, RingtailConfig, Role, RingtailField) {
    var vm        = this;
    vm.role       = this.role;
    vm.currentValues  = this.currentValues;

    activate();

    //////////

    function activate() {
      RingtailConfig
        .get(vm.role)
        .success(processConfigs);
    }


    function processConfigs(kvps) {    
      var keys = _.pluck(kvps, 'key');
      vm.fields = keys.map(function(key) {
        
        var field = RingtailField.getField(key)
          , currentValue = vm.currentValues[key]
          ;

        field.value = currentValue || field.default;
        return field;
      });
    }

  }


}());