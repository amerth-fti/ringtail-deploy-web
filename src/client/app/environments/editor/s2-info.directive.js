(function() {
  'use strict';

  angular
    .module('app.environments.editor')
    .directive('envwizardInfo', envwizardInfo);

  function envwizardInfo() {
    return {
      restrict: 'E',
      scope: {
        cancel: '=',
        environment: '=',
        update: '=',
        trash: '=',
        wizard: '='
      },
      templateUrl: '/app/environments/editor/s2-info.html',
      controller: NewEnvironmentInfoController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  NewEnvironmentInfoController.$inject = [ ];

  function NewEnvironmentInfoController() {
    var vm = this;
    vm.next         = next;
    vm.prev         = prev;

    activate();

    //////////

    function activate() {
    }

    function next() {
      if(vm.environment.envName.trim().length == 0){
        $('.error.name').html('name required');
        return;        
      }

      if(vm.environment.host.trim().length == 0){
        $('.error.host').html('host required');
        return;        
      }

      $('.form-group .error').html('');

      vm.wizard.stage = 'configs';
    }

    function prev() {
      vm.wizard.stage = 'method';
    }
  }

}());