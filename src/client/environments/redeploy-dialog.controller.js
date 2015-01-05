(function () {
  'use strict';

  angular
    .module('app.environments')
    .controller('EnvironmentRedeployController', EnvironmentRedeployController);

  EnvironmentRedeployController.$inject = [ '$modalInstance', 'config', 'environment' ];

  function EnvironmentRedeployController($modalInstance, config, environment) {
    var vm = this;
    vm.branches           = config.branches;
    vm.duration           = 120;
    vm.environment        = environment;
    vm.selectedTasks      = null;
    vm.showAdvanced       = false;
    vm.cancel             = cancel;
    vm.rebuild            = rebuild;
    vm.toggleAdvanced     = toggleAdvanced;
    vm.toggleSelectedTask = toggleSelectedTask;

    activate();

    //////////

    function activate() {
      vm.environment = angular.copy(environment);

      if(environment.config.taskdefs) {      
        vm.selectedTasks = vm.environment.config.taskdefs.slice(0);
      }  
    }
    
    function cancel() {
      $modalInstance.dismiss();
    }

    function rebuild() {
      angular.copy(vm.environment, environment);
      environment.selectedTasks = vm.selectedTasks;
      $modalInstance.close();
    }

    function toggleAdvanced() {
      vm.showAdvanced = !vm.showAdvanced;
    }

    function toggleSelectedTask(taskdef) {
      var index = vm.selectedTasks.indexOf(taskdef);
      if(index > -1) {
        vm.selectedTasks.splice(index,1);
      } else {
        vm.selectedTasks.push(taskdef);
      }
    }
  }

}());