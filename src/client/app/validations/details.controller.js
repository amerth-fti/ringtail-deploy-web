(function () {
  'use strict';

  angular
    .module('app')
    .controller('ValidationDetailsController', ValidationDetailsController);

  ValidationDetailsController.$inject = [ '$routeParams', '$timeout', '$scope', 'Validation' ];

  function ValidationDetailsController($routeParams, $timeout, $scope, Validation) {    
    var vm          = this;
    vm.job          = null;
    vm.poll         = null;
    
    activate();
    
    //////////
    
    function activate() {
      Validation.get({ validationId: $routeParams.validationId }, loadComplete);

      // cancel polling on scope destroy
      $scope.$on('$destroy', function() {
        $timeout.cancel(vm.poll);
      });      
    }

    function loadComplete(result) {
      vm.job = result;
      pollWhileRunning(result);

      if(result.status !== 'Running') {
        vm.job.started = [];
      }
    }

    function pollWhileRunning(job) {
      if(job.status === 'Running') {
        vm.poll = $timeout(function() {
          job.$get(loadComplete);
        }, 5000);
      } else {
        vm.job.started = [];
      }
    }
  }


}());
