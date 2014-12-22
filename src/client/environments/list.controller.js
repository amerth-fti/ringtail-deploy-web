(function() {
  'use strict';

  angular
    .module('app')
    .controller('EnvironmentListController', EnvironmentListController);

  EnvironmentListController.$inject = [ '$routeParams', 'Project', 'Environment' ];

  function EnvironmentListController($routeParams, Project, Environment) {
    var vm          = this;
    vm.project      = null;
    vm.environments = [];
    
    activate();

    //////////
    
    function activate() {
      
      // load the project
      vm.project = Project.get({ projectId: $routeParams.projectId });
        
      // load each environment
      Environment.project({ projectId: $routeParams.projectId}, function(environments) {
        environments.forEach(function(environment) {
          environment.$get(envLoaded);
        });
      });
    }
    
    function envLoaded(environment) {      
      if(environment.show) {
        vm.environments.push(environment);
        vm.environments.sort(function(env1, env2) {
          return env1.name.toLowerCase() > env2.name.toLowerCase();
        });
      }
    }
  }

}());