(function() {
  'use strict';

  angular
    .module('app.environments.starter')
    .factory('EnvironmentStarter', EnvironmentStarter);

  EnvironmentStarter.$inject = [ '$modal' ];
  
  function EnvironmentStarter($modal) {    
    return {
      open: open
    };

    function open(environment) {
      return $modal.open({
        templateUrl: '/app/environments/start-dialog.html',
        controller: EnvironmentStartController,
        controllerAs: 'vm',
        resolve: {
          environment: function() { 
            return environment;
          }
        }
      });
    }
  }

  EnvironmentStartController.$inject = [ '$modalInstance', 'environment' ]; 

  function EnvironmentStartController($modalInstance, environment) {
    var vm          = this;
    vm.environment  = null;
    vm.duration     = 15;
    vm.cancel       = cancel;
    vm.start        = start;

    activate();

    //////////

    function activate() {
      vm.environment = angular.copy(environment);
    }

    function cancel() {
      $modalInstance.dismiss();
    }

    function start() {      
      angular.copy(vm.environment, environment);

      var qs = {
        suspend_on_idle: vm.duration * 60,
      };

      environment
        .$start(qs, activate)      
        .then(function() {
          $modalInstance.close(environment);
        });
    }
  }

}());