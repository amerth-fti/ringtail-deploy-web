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
      var fields
        , fieldLookup = {}
        ;

      fields = configKeys.map(function(configKey) {
        
        var field = RingtailField.getFieldForConfigKey(configKey)
          , configKeyParts = configKey.split('|')
          , currentValue = unescapeValue(vm.values[configKey])
          , commonValue = unescapeValue(vm.values['Common|' + configKeyParts[1]])
          ;

        field.configKey = [ configKey ];
        field.value = currentValue || commonValue || field.default;        
        return field;
      });

      // dedup fields
      fields.forEach(function(field) {
        var key = field.key;
        if(!fieldLookup[key]) {
          fieldLookup[key] = field;
        } else {
          field.configKey.forEach(function(configKey) {
            fieldLookup[key].configKey.push(configKey);
          });
        }
      });

      // get list of dedeuped fields
      vm.fields = _.values(fieldLookup);

      // push updates to all configs
      vm.fields.forEach(updateField);
    }

    function escapeValue(value) {
      var result = value; 
      if(value && value.indexOf(' ') > 0) {
        result = '"""' + value + '"""';
      }
      return result;
    }

    function unescapeValue(value) {
      var result = value ? value.replace(/"""/g, '') : value;
      return result;
    }

    function updateField(field) { 
      var value
        , ignore
        ;

      // validate the change;
      field.validate();

      // should ignore
      ignore = field.value === field.ignoreWhen;

      // escape value
      value = field.value;
      value = escapeValue(value);    

      //write values for all field mappings
      field.configKey.forEach(function(configKey) {
        if(!ignore) {
          vm.values[configKey] = value;
        }
        else {
          delete vm.values[configKey];
        }
      });      

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