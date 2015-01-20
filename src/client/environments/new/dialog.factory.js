(function() {
  'use strict';

  angular
    .module('app.environments.new')
    .factory('EnvironmentEditor', EnvironmentEditor);

  EnvironmentEditor.$inject = [ '$modal' ];
  
  function EnvironmentEditor($modal) {    
    return {
      open: open
    };

    function open(environment) {
      return $modal.open({
        templateUrl: '/app/environments/new/dialog.html',
        controller: EnvironmentEditorController,
        controllerAs: 'vm',
        resolve: {
          environment: function() {
            return environment;
          }
        }
      });
    }
  }
    
  EnvironmentEditorController.$inject = [ '$modalInstance', 'Environment', 'environment' ];

  function EnvironmentEditorController($modalInstance, Environment, environment) {
    var vm          = this;
    vm.environment  = environment || new Environment();
    vm.cancel       = cancel;
    vm.create       = create;

    vm.wizard       = {
      stage: 'method'
    };
    
    activate();

    //////////
    
    function activate() {      
    }

    function cancel() {
      $modalInstance.dismiss();
    }

    function create() {
      vm.environment.$save()
      .then(function(environment) {
        $modalInstance.close(environment);  
      });      
    }

    function setEnv(env) {
      vm.environment = env;
    }
  }

}());