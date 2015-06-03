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

    function open(config) {
      return $modal.open({
        templateUrl: '/app/environments/config/dialog.html',
        controller: Controller,
        controllerAs: 'vm',
        resolve: {
          config: function() {
            return config;
          }
        }
      });
    }
  }

  Controller.$inject = [ '$scope', '$modalInstance', 'config' ];

  function Controller($scope, $modalInstance, config) {
    var vm    = this;
    vm.config = config;
    vm. mode  = null;
    vm.cancel = cancel;
    vm.submit = submit;

    activate();

    //////////

    function activate() {
      vm.mode = vm.config ? 'edit' : 'create';      
    }


    function cancel() {
      $modalInstance.dismiss();
    }

    function submit() {
      config.$update().then(function(result) {
        $modalInstance.close(result);    
      });      
    }
    
  }
  
}());