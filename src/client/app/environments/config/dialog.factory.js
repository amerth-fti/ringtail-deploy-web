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
    var vm    = this;    
    vm.host   = host;
    vm.config = null;
    vm.mode   = null;
    vm.cancel = cancel;
    vm.submit = submit;

    activate();

    //////////

    function activate() {
      vm.mode = config.configId ? 'edit' : 'create';
      vm.config = angular.copy(config);
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
    
  }
  
}());