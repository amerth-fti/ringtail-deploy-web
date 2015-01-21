(function() {
  'use strict';

  angular
    .module('app.environments')
    .controller('EnvironmentListController', EnvironmentListController);

  EnvironmentListController.$inject = [ 'Environment', 'EnvironmentEditor' ];

  function EnvironmentListController(Environment, EnvironmentEditor) {
    var vm            = this;
    vm.environments   = [];
    vm.newEnvironment = newEnvironment;
    
    activate();

    //////////
    
    function activate() {
      vm.environments = Environment.query();
    }

    function newEnvironment() {
      return EnvironmentEditor.open()
        .result
        .then(function(env) {
          vm.environments.push(env);
        });
    }
  }

}());