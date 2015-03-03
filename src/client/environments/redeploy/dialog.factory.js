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
        templateUrl: '/app/environments/redeploy/dialog.html',
        controller: EnvironmentRedeployController,
        controllerAs: 'vm',
        resolve: {
          environment: function() {
            return environment;
          }
        }
      });
    }
  }

  EnvironmentRedeployController.$inject = [ '$modalInstance', '$location', 'config', 'environment' ];

  function EnvironmentRedeployController($modalInstance, $location, config, environment) {
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
      
      // trigger the redeployment
      environment.$redeploy()

      // shut the dialog since we had success
      .then(function(environment) {
        $modalInstance.close(environment);
        return environment;
      })

      // transition to the job details
      .then(function(environment) {
        var path = '/app/jobs/' + environment.deployedJobId;          
        $location.path(path);
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