(function() {
  'use strict';

  angular
    .module('app.environments')
    .directive('environmentsList', environmentsList);

  function environmentsList() {
    return { 
      restrict: 'E',
      scope: {
        environments: '='        
      },
      templateUrl: '/app/environments/list.html',
      controller: EnvironmentListController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  EnvironmentListController.$inject = [ ];

  function EnvironmentListController() {
    var vm = this;
    
    activate();

    //////////
    
    function activate() {
    }
  }

}());