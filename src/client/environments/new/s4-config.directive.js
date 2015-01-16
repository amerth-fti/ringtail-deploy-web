(function() {
  'use strict';
  
  angular
    .module('app.environments.new')
    .directive('envwizardConfig', envwizardConfig);
  
  function envwizardConfig() {
    return { 
      restrict: 'E',
      scope: {
        cancel: '=',
        create: '=',
        environment: '=',
        wizard: '=',
      },
      templateUrl: 'client/environments/new/s4-config.html',
      controller: DirectiveController,
      controllerAs: 'vm',
      bindToController: true
    };
  }
  
  DirectiveController.$inject = [ 'SkytapEnvironment', 'environmentFactory' ];
  
  function DirectiveController() {
    var vm            = this;
    vm.config         = null;
    vm.configChanged  = configChanged;   
    vm.prev           = prev;
    vm.invalid        = false;
    
    activate();
    
    //////////
    
    function activate() {
      vm.config = JSON.stringify(vm.environment.config, null, 2);
    }

    function configChanged() {
      try 
      {
        vm.environment.config = JSON.parse(vm.config);
        vm.invalid = false;
      }
      catch(ex) {
        vm.invalid = true;
      }
    }

    function prev() {
      vm.wizard.stage = 'machines';
    }

  }
  
}());