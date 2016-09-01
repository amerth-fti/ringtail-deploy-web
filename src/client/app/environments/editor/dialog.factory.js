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

  EnvironmentEditorController.$inject = [ '$modalInstance', '$routeParams', 'Environment', 'environment', 'Wizard', 'Region', 'Config', '$scope', 'ValidationMessage' ];

  function EnvironmentEditorController($modalInstance, $routeParams, Environment, environment, Wizard, Region, Config, $scope, ValidationMessage) {
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
      vm.wizard.error = null;
    }

    function cancel() {
      if(vm.wizard.mode === 'new') {
        vm.environment.$remove();
      }
      $modalInstance.dismiss();
    }

    function create() {
      return vm.environment
        .$save()
        .then(function(environment) {
          var currentRegion = $routeParams.regionId;
          Region.addEnv({regionId:currentRegion, envId: environment.envId});
        });
    }

    function update(skipValidation = false) {
      ValidationMessage.clearMessage();
      if(environment) {
        angular.copy(vm.environment, environment);
        if(!skipValidation && validateConfigs(environment).length > 0){
          return;
        }
      }
      return vm.environment
        .$update()
        .then(function(environment){
          $modalInstance.close(environment);
        });
    }

    function validateConfigs(environment){
      var inValidMachines = [],
      postErrorMessage = false,
      errorMessage = 'The listed machine does not have its config set';

      environment.machines.forEach(function(machineDetail) {
          if(machineDetail.configId == null){
            inValidMachines.push(machineDetail);
            postErrorMessage = true;
          }
        }, this);

        if(postErrorMessage === true){
          if(inValidMachines.length > 1){
            errorMessage = 'The listed machines do not have their config set';
          }

          var dataDetails = {
            invalidmachines: inValidMachines,
            message: errorMessage,
            stage: 'machines'
          };
          ValidationMessage.setMessage(dataDetails.stage, dataDetails.message, dataDetails.invalidmachines);
        }

        return inValidMachines;
    }

    function configs() {
      return Config.findByEnv({ envId: vm.environment.envId }, function(configs) {
        vm.configs.push.apply(vm.configs, configs);
      });
    }
  }

}());