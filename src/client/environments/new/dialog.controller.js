(function() {
  'use strict';

  angular
    .module('app')
    .controller('NewEnvironmentController', NewEnvironmentController);

  NewEnvironmentController.$inject = [ '$routeParams', '$modalInstance', 'Environment' ];

  function NewEnvironmentController($routeParams, $modalInstance, Environment) {
    var vm          = this;
    vm.environments = [];  
    vm.cancel       = cancel;
    vm.create       = create;  
    
    activate();

    //////////
    
    function activate() {
      vm.environments = Environment.query();
    }

    function cancel() {
      $modalInstance.dismiss();
    }

    function create() {

          
      $modalInstance.close();
    }
  }

}());