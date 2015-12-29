(function() {
  'use strict';

  angular
    .module('app.environments.config')
    .factory('ConfigEditor', ConfigEditor);

  ConfigEditor.$inject = [ '$modal' ];

  function ConfigEditor($modal) {
    return {
      open: open
    };

    function open(config, host) {
      return $modal.open({
        templateUrl: '/app/environments/config/dialog.html',
        controller: Controller,
        controllerAs: 'vm',
        resolve: {
          config: function() {
            return config;
          },
          host: function() {
            return host;
          }
        }
      });
    }
  }

  Controller.$inject = [ '$scope', '$modalInstance', 'config', 'host' ];

  function Controller($scope, $modalInstance, config, host) {
    var vm         = this;
    vm.host        = host;
    vm.config      = null;
    vm.data        = null;
    vm.mode        = null;
    vm.simple      = true;
    vm.invalid     = false;
    vm.cancel      = cancel;
    vm.submit      = submit;
    vm.dataChanged = dataChanged;

    activate();

    //////////

    function activate() {
      vm.mode = config.configId ? 'edit' : 'create';
      vm.config = angular.copy(config);

      // handle updates from editor
      $scope.$watch('vm.config', function(config) {
        if(config) {
          vm.data = JSON.stringify(config.data, null, 2);
        }
      }, true);
    }


    function cancel() {
      $modalInstance.dismiss();
    }

    function submit() {
      angular.copy(vm.config, config);
      if(vm.mode === 'edit') {
        config.$update().then(function(result) {
          $modalInstance.close(result);
        });
      } else {
        config.$save().then(function(result) {
          $modalInstance.close(result);
        });
      }
    }

    function dataChanged() {
      try
      {
        vm.config.data = JSON.parse(vm.data);
        vm.invalid = false;
      }
      catch(ex) {
        vm.invalid = true;
      }
    }

  }

}());