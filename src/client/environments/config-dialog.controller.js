(function () {
  'use strict';

  angular
    .module('app')
    .controller('EnvironmentConfigController', EnvironmentConfigController);

  EnvironmentConfigController.$inject = ['$scope', '$modalInstance', 'config', 'environment'];

  function EnvironmentConfigController($scope, $modalInstance, config, environment) {
    $scope.environment = environment;

    $scope.save = function() {           
      $modalInstance.close();
    }

    $scope.cancel = function() {
      $modalInstance.dismiss();      
    }

  }

}());
