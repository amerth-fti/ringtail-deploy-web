(function () {
  'use strict';

  angular
    .module('app')
    .controller('EnvironmentRedeployController', EnvironmentRedeployController);

  EnvironmentRedeployController.$inject = [ '$modalInstance', 'config', 'environment', 'DeployInfo' ];

  function EnvironmentRedeployController($modalInstance, config, environment, DeployInfo) {
    var vm = this;
    vm.branches           = config.branches;
    vm.deployinfo         = new DeployInfo(); 
    vm.duration           = 120;
    vm.environment        = environment;
    vm.selectedBranch     = null;    
    vm.showAdvanced       = false;
    vm.cancel             = cancel;
    vm.rebuild            = rebuild;
    vm.toggleAdvanced     = toggleAdvanced;
    vm.toggleSelectedTask = toggleSelectedTask;

    activate();

    //////////

    function activate() {
      if(environment.deployment.taskdefs) {      
        vm.selectedTasks = environment.deployment.taskdefs.slice(0);
      }  
    }
    
    function cancel() {
      $modalInstance.dismiss();
    }

    function rebuild() {
      $modalInstance.close({
        branch:     vm.selectedBranch,
        taskdefs:   vm.selectedTasks,
        deployinfo: vm.deployinfo
      });
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