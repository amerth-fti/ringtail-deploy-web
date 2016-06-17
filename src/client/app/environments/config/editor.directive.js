(function() {
  'use strict';

  angular
    .module('app.environments.config')
    .directive('configEditor', configEditor);

  function configEditor() {
    return {
      restrict: 'E',
      scope: {
        config: '=',
        host: '='
      },
      templateUrl: '/app/environments/config/editor.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ '_', 'Role', 'RingtailConfig', 'RingtailField', '$scope' ];

  function Controller(_, Role, RingtailConfig, RingtailField, $scope) {
    var vm = this;
    vm.config       = this.config;
    vm.host         = this.host;
    vm.dataJson     = null;
    vm.fields       = null;
    vm.roles        = null;
    vm.selectedRole = null;
    vm.simple       = false;
    vm.roleChanged  = roleChanged;
    vm.updateField  = updateField;
    vm.rawDataChanged = rawDataChanged;

    activate();

    //////////

    function activate() {
      vm.data         = vm.config.data;
      vm.selectedRole = vm.config.roles[0];
      vm.roles = Role.roles();
      roleChanged();

      // ensure that changes to the parent simple mode
      // render the simple editor here, this is sort of hacky
      // and should use a "state" obj that gets passed into
      // the directive or something like that
      $scope.$parent.$watch('vm.simple', function(simple) {
        vm.simple = simple;
      });

      // re-parse the data object if there are any changes
      $scope.$watch('vm.config.data', function(config) {
        dataToJson();
      }, true);
    }

    function roleChanged() {
      vm.config.roles[0] = vm.selectedRole;
      buildFields(
        RingtailConfig.configsForRole(vm.selectedRole)
      );
    }

    function buildFields(configKeys) {
      var fields
        , fieldLookup = {}
        ;

      fields = configKeys.map(function(configKey) {

        var field = RingtailField.getFieldForConfigKey(configKey)
          , configKeyParts = configKey.split('|')
          , currentValue = unescapeValue(vm.config.data[configKey])
          , commonValue = unescapeValue(vm.config.data['Common|' + configKeyParts[1]])
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
          vm.config.data[configKey] = value;
        }
        else {
          delete vm.config.data[configKey];
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

    function findField(configKey) {
      var results = _.filter(vm.fields, function(field) {
        return field.configKey.indexOf(configKey) >= 0;
      });
      return results[0];
    }

    function dataToJson() {
      vm.dataJson = JSON.stringify(vm.data, null, 2);
    }

    function rawDataChanged() {
      try
      {
        var data = JSON.parse(vm.dataJson)
          , key
          , field
          ;
        for (key in data) {
          if(true) {
            field = findField(key);
            if(field) {
              field.value = data[key];
              updateField(field);
            }
          }
        }
      }
      catch(ex)
      {
      }
    }
  }

}());