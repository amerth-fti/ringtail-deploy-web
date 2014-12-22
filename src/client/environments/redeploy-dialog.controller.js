(function () {
  'use strict';

  angular
    .module('app')
    .controller('EnvironmentRedeployController', EnvironmentRedeployController);

  EnvironmentRedeployController.$inject = [ '$scope', '$modalInstance', 'config', 'environment', 'DeployInfo' ];

  function EnvironmentRedeployController($scope, $modalInstance, config, environment, DeployInfo) {
    $scope.environment = environment;
    $scope.branches = config.branches;
    $scope.selectedBranch;    
    $scope.duration = 120;
    $scope.showAdvanced = false;      
    $scope.deployinfo = new DeployInfo(); 

    
    if(environment.deployment.taskdefs) {      
      $scope.selectedTasks = environment.deployment.taskdefs.slice(0);
    }

    $scope.rebuild = function() {
      $modalInstance.close({
        branch: $scope.selectedBranch,
        taskdefs: $scope.selectedTasks,
        deployinfo: $scope.deployinfo
      });
    }

    $scope.cancel = function() {
      $modalInstance.dismiss();
    }

    $scope.toggleAdvanced = function() {
      $scope.showAdvanced = !$scope.showAdvanced;
    }

    $scope.toggleSelectedTask = function(taskdef) {
      var index = $scope.selectedTasks.indexOf(taskdef);
      if(index > -1) {
        $scope.selectedTasks.splice(index,1);
      }
      else {
        $scope.selectedTasks.push(taskdef);
      };
    }

  }

}());