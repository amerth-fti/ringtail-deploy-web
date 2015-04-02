(function() {
  'use strict';

  angular
    .module('app.environments.starter')
    .factory('EnvironmentRedeploy', EnvironmentRedeploy);

  EnvironmentRedeploy.$inject = [ '$modal' ];
  
  function EnvironmentRedeploy($modal) {    
    return {
      open: open
    };

    function open(environment) {
      return $modal.open({
        template: '<env-redeploy environment="vm.environment" modal-instance="vm.modalInstance"></env-redeploy>',
        controller: Controller,
        controllerAs: 'vm',
        resolve: {
          environment: function() {
            return environment;
          }
        }
      });
    }
  }

  Controller.$inject = [ '$modalInstance', 'environment' ];

  function Controller($modalInstance, environment) {
    var vm = this;
    vm.modalInstance = $modalInstance;
    vm.environment = environment;

    activate();

    //////////

    function activate() {
      vm.modalInstance.controller = vm;
    }
  }

}());