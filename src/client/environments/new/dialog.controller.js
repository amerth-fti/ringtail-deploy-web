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
    vm.create       = create;

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

    function create() {
      vm.environment.$save()
      .then(function(environment) {
        $modalInstance.close(environment);  
      });      
    }
  }

}());