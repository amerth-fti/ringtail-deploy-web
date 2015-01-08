(function() {
  'use strict';

  angular
    .module('app.environments')
    .controller('EnvironmentListController', EnvironmentListController);

  EnvironmentListController.$inject = [ '$routeParams', 'Environment', 'EnvironmentEditor' ];

  function EnvironmentListController($routeParams, Environment, EnvironmentEditor) {
    var vm            = this;
    vm.environments   = [];
    vm.newEnvironment = newEnvironment;
    
    activate();

    //////////
    
    function activate() {
      vm.environments = Environment.query();
    }

    function newEnvironment() {
      EnvironmentEditor.open()
        .result
        .then(function(env) {
          vm.environments.push(env);
        });
    }
  }

}());