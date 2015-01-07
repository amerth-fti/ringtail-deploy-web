(function() {
  'use strict';

  angular
    .module('app')
    .controller('NewEnvironmentController', NewEnvironmentController);

  NewEnvironmentController.$inject = [ '$routeParams', '$modalInstance', 'Environment' ];

  function NewEnvironmentController($routeParams, $modalInstance, Environment) {
    var vm          = this;
    vm.environment  = new Environment();
    vm.cancel       = cancel;

    vm.wizard       = {
      stage: 'method'
    };
    
    activate();

    //////////
    
    function activate() {
      vm.environments = Environment.query();
    }

    function cancel() {
      $modalInstance.dismiss();
    }
  }

}());