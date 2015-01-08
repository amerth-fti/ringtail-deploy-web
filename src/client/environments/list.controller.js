(function() {
  'use strict';

  angular
    .module('app.environments')
    .controller('EnvironmentListController', EnvironmentListController);

  EnvironmentListController.$inject = [ '$routeParams', '$modal', 'Environment' ];

  function EnvironmentListController($routeParams, $modal, Environment) {
    var vm          = this;
    vm.environments = [];
    vm.newEnvironment = newEnvironment;
    
    activate();

    //////////
    
    function activate() {
      vm.environments = Environment.query();
    }

    function newEnvironment() {
      $modal
        .open({
          templateUrl: 'client/environments/new/dialog.html',
          controller: 'NewEnvironmentController',
          controllerAs: 'vm'
        })
        .result
        .then(function(env) {
          vm.environments.push(env);
        });        
    }
  }

}());