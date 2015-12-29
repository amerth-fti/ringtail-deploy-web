(function() {
  'use strict';

  angular
    .module('app.environments.machine')
    .directive('machineEditor', machineEditor);

  function machineEditor() {
    return {
      restrict: 'E',
      scope: {
        machine: '=',
        remoteType: '=',
        configs: '='
      },
      templateUrl: '/app/environments/machine/editor.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ ];

  function Controller() {
    var vm = this;
    vm.machine    = this.machine;
    vm.remoteType = this.remoteType;
    vm.configs    = this.configs;

    activate();

    //////////

    function activate() {
    }
  }

}());