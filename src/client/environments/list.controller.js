(function() {
  'use strict';

  angular
    .module('app')
    .controller('EnvironmentListController', EnvironmentListController);

  EnvironmentListController.$inject = [ '$routeParams', 'Project', 'Environment' ];

  function EnvironmentListController($routeParams, Project, Environment) {
    var vm          = this;
    vm.environments = [];
    
    activate();

    //////////
    
    function activate() {
      vm.environments = Environment.query();
    }
  }

}());