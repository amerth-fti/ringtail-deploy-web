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
        size: 'lg',
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
      stage: 'method',
      stageInstance: null,
      stages: [
        { stage: 'method', name: 'Type', active: true },
        { stage: 'skytap', name: 'Skytap', active: false },
        { stage: 'info', name:'Information', active: false },
        { stage: 'machines', name: 'Machines', active: false },
        { stage: 'config', name: 'Configuration', active: false }
      ],
      next: function() {
        
      },
      prev: function() {

      },
      goto: function(stage) {
        
      }
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