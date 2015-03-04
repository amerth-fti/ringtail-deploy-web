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
        host: '=',
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
    vm.host         = this.host;
    vm.role         = this.role;
    vm.values       = this.values;
    vm.fields       = null;    
    vm.updateField  = updateField;        

    activate();

    //////////

    function activate() {      
      var configs = RingtailConfig.configsForRole(vm.role);
      processConfigs(configs);      
    }

    function processConfigs(configKeys) {      
      vm.fields = configKeys.map(function(configKey) {
        
        var field = RingtailField.getFieldForConfigKey(configKey)
          , currentValue = vm.values[configKey]
          ;

        field.configKey = configKey;
        field.value = currentValue || field.default;        
        return field;
      });

      // TODO - dedup fields

      // push updates to all configs
      vm.fields.forEach(updateField);
    }

    function updateField(field) { 
      // validate the change;
      field.validate();

      // TODO - after depud, write values for all field mappings
      vm.values[field.configKey] = field.value;      

      // propagate protocol changes
      if(field.type === 'protocol') {
        protocolChanged(field.value);
      }
    }

    function createUrl(protocol, field) {
      var path = field.defaultPath
        , parts
        ;

      if(field.value) {
        parts = field.value.split('/');
        path =  parts.slice(3).join('/'); // ['http:', '', 'host', 'path']
      }

      return protocol + '://' + vm.host + '/' + path;
    }

    function protocolChanged(protocol) {
      var fields = _.where(vm.fields, { type: 'url' });
      fields.forEach(function(field) {
        field.value = createUrl(protocol, field);
        updateField(field);
      });
    }

  }


}());