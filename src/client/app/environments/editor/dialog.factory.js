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
        size: 'lg',
        'backdrop': false,
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

  EnvironmentEditorController.$inject = [ '$modalInstance', '$routeParams', 'Environment', 'environment', 'Wizard', 'Region', 'Config', '$scope' ];

  function EnvironmentEditorController($modalInstance, $routeParams, Environment, environment, Wizard, Region, Config, $scope) {
    var vm          = this;
    vm.environment  = null;
    vm.configs      = [];
    vm.cancel       = cancel;
    vm.update       = update;
    vm.wizard       = null;

    activate();

    //////////

    function activate() {
      var mode;
      if(environment) {
        vm.environment = angular.copy(environment);
        mode = 'edit';
        configs();
      } else {
        vm.environment = new Environment();
        mode = 'new';
        create().then(configs);
      }
      vm.wizard = new Wizard(mode);
    }

    function cancel() {
      if(vm.wizard.mode === 'new') {
        vm.environment.$remove(function(){
          $modalInstance.dismiss();    
        });
      } else {
       $modalInstance.dismiss();    
      }
    }

    function create() {
      return vm.environment
        .$save()
        .then(function(environment) {
          var currentRegion = $routeParams.regionId;
          Region.addEnv({regionId:currentRegion, envId: environment.envId});
        });
    }

    function update() {
      if(environment) {
        angular.copy(vm.environment, environment);
      }
      return vm.environment
        .$update()
        .then(function(environment){
          $modalInstance.close(environment);
        });
    }

    function configs() {
      return Config.findByEnv({ envId: vm.environment.envId }, function(configs) {
        vm.configs.push.apply(vm.configs, configs);
      });
    }
  }

}());