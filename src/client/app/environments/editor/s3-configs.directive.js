(function() {
  'use strict';
  
  angular
    .module('app.environments.editor')
    .directive('envwizardConfigs', envwizardConfigs);
  
  function envwizardConfigs() {
    return { 
      restrict: 'E',
      scope: {        
        cancel: '=',
        environment: '=',
        update: '=',
        wizard: '='
      },
      templateUrl: '/app/environments/editor/s3-configs.html',
      controller: NewEnvironmentInfoController,
      controllerAs: 'vm',
      bindToController: true
    };
  }
  
  NewEnvironmentInfoController.$inject = [ ];
  
  function NewEnvironmentInfoController() {
    var vm = this;
    vm.next         = next;
    vm.prev         = prev;
    
    activate();
    
    //////////
    
    function activate() {
    }

    function next() {
      vm.wizard.stage = 'machines';      
    }

    function prev() {
      vm.wizard.stage = 'method';
    }
  }
  
}());