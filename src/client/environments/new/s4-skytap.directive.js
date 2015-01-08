(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('envwizardSkytap', envwizardSkytap);
  
  function envwizardSkytap() {
    return { 
      restrict: 'E',
      scope: {
        cancel: '=',
        create: '=',
        environment: '=',
        wizard: '=',
      },
      templateUrl: 'client/environments/new/s4-skytap.html',
      controller: NewEnvironmentSkytapController,
      controllerAs: 'vm'
    };
  }
  
  NewEnvironmentSkytapController.$inject = [ '$scope', 'SkytapEnvironment' ];
  
  function NewEnvironmentSkytapController($scope, SkytapEnvironment) {
    var vm = this;
    vm.cancel       = $scope.cancel;
    vm.create       = $scope.create;
    vm.environment  = $scope.environment;
    vm.wizard       = $scope.wizard;

    vm.pageData     = null;
    vm.currentPage  = 1;
    vm.environments = null;      
    vm.pagingActive = false;
    vm.pageSize     = 10;
    vm.selected     = null;
    vm.totalItems   = 0;
    
    vm.pageChanged  = pageChanged;
    vm.prev         = prev;

    
    activate();
    
    //////////
    
    function activate() {
      SkytapEnvironment.query(function(environments) {
        vm.environments = environments;        
        vm.totalItems = environments.length;
        vm.pagingActive = vm.totalItems > vm.pageSize;
        pageChanged();
      });
    }

    function pageChanged() {
      var pageStart = (vm.currentPage - 1) * vm.pageSize;
      vm.pageData = vm.environments.slice(pageStart, pageStart + vm.pageSize);
    }

    function prev() {
      vm.wizard.stage = 'method';
    }
  }
  
}());