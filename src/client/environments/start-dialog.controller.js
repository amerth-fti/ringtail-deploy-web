(function() {
  'use strict';

  angular
    .module('app')
    .controller('EnvironmentStartController', EnvironmentStartController);

  EnvironmentStartController.$inject = [ '$scope', '$modalInstance', 'environment', 'DeployInfo' ]; 

  function EnvironmentStartController($scope, $modalInstance, environment, DeployInfo) {
    $scope.environment = environment;
    $scope.deployinfo = new DeployInfo();
    $scope.duration = 15;

    $scope.start = function() {
      $modalInstance.close({ 
        duration: $scope.duration, 
        deployinfo: $scope.deployinfo
      });
    }

    $scope.cancel = function() {
      $modalInstance.dismiss();
    }
  }

}());