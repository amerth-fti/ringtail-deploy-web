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
        values: '='
      },
      templateUrl: '/app/environments/taskdefs/ringtail/field-editor.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ '$scope', '_', 'RingtailConfig', 'Role', 'RingtailField' ];

  function Controller($scope, _, RingtailConfig, Role, RingtailField) {
    var vm          = this;
    vm.role         = this.role;
    vm.values       = this.values;
    vm.fields       = null;
    vm.updateField  = updateField;

    activate();

    //////////

    function activate() {
      RingtailConfig
        .get(vm.role)
        .success(processConfigs);    
    }


    function processConfigs(configs) {    
      var configKeys = _.pluck(configs, 'key');

      // TODO - dedup fields
      vm.fields = configKeys.map(function(configKey) {
        
        var field = RingtailField.getField(configKey)
          , currentValue = vm.values[configKey]
          ;
        field.configKey = configKey;
        field.value = currentValue || field.default;        
        return field;
      });

      // push updates to all configs
      vm.fields.forEach(updateField);
    }

    function updateField(field) { 
      // TODO write values for all field members
      vm.values[field.configKey] = field.value;
    }

  }


}());