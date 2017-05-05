(function() {
  'use strict';

  angular
    .module('app.environments.editor')
    .directive('envwizardConfigs', envwizardConfigs);

  function envwizardConfigs() {
    return {
      restrict: 'E',
      scope: {
        cancel: '=',
        environment: '=',
        configs: '=',
        update: '=',
        wizard: '='
      },
      templateUrl: '/app/environments/editor/s3-configs.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ 'Config', 'ConfigEditor'];

  function Controller(Config, ConfigEditor) {
    var vm = this;
    vm.configs   = this.configs;
    vm.add       = add;
    vm.edit      = edit;
    vm.copy      = copy;
    vm.remove    = remove;
    vm.next      = next;
    vm.prev      = prev;

    activate();

    //////////

    function activate() {

    }

    function add() {
      var config = new Config({
        configName: null,
        roles: [ '' ],
        data: { },
        envId: vm.environment.envId
      });
      ConfigEditor.open(config, vm.environment.host)
        .result
        .then(function(config) {
          if(config) {
            vm.configs.push(config);
          }
        });
    }

    function edit(config) {
      config.envId = vm.environment.envId;
      ConfigEditor.open(config, vm.environment.host);
    }

    function remove(config) {
      config.$remove().then(function() {
        var index = vm.configs.indexOf(config);
        vm.configs.splice(index, 1);
      });
    }

    function copy(config) {
      var newConfig  = angular.copy(config);
      newConfig.configId = null;
      ConfigEditor.open(newConfig, vm.environment.host)
        .result
        .then(function(config) {
          if(config) {
            vm.configs.push(config);
          }
        });
    }

    function next() {
      vm.wizard.stage = 'machines';
    }

    function prev() {
      vm.wizard.stage = 'method';
    }
  }

}());