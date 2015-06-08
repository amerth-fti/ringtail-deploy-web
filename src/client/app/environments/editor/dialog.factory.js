(function() {
  'use strict';

  angular
    .module('app.environments.editor')
    .factory('EnvironmentEditor', EnvironmentEditor);

  EnvironmentEditor.$inject = [ '$modal' ];
  
  function EnvironmentEditor($modal) {    
    return {
      open: open
    };

    function open(environment) {
      return $modal.open({
        templateUrl: '/app/environments/editor/dialog.html',
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
    
  EnvironmentEditorController.$inject = [ '$modalInstance', '$routeParams', 'Environment', 'environment', 'Wizard', 'Region' ];

  function EnvironmentEditorController($modalInstance, $routeParams, Environment, environment, Wizard, Region) {
    var vm          = this;
    vm.environment  = null;
    vm.cancel       = cancel;
    vm.create       = create;
    vm.update       = update;
    vm.wizard       = null;
    
    activate();

    //////////
    
    function activate() {  
      var mode;
      if(environment) {
        vm.environment = angular.copy(environment);
        mode = 'edit';
      } else {
        vm.environment = new Environment();
        mode = 'new';
      }
      vm.wizard = new Wizard(mode);


    }

    function cancel() {
      $modalInstance.dismiss();
    }

    function create() {      
      vm.environment
        .$save()

        // add to regions
        .then(function(environment) {
          var defaultRegion = '1'
            , currentRegion = $routeParams.regionId
            ;

          // insert default
          Region.addEnv({regionId:defaultRegion, envId: environment.envId});

          // insert current
          if(currentRegion && defaultRegion !== currentRegion) {
            Region.addEnv({regionId:currentRegion, envId: environment.envId});
          }

          return environment;
        })
        .then(function(environment){
          $modalInstance.close(environment);
        });
    }

    function update() {
      angular.copy(vm.environment, environment);
      environment
        .$update()
        .then(function(environment){
          $modalInstance.close(environment);
        });
    }
  }

}());