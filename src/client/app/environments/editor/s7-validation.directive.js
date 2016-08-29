(function() {
  'use strict';

  angular
    .module('app.environments.editor')
    .directive('envwizardValidation', envwizardValidation);

  function envwizardValidation() {
    return {
      restrict: 'E',
      scope: {
        cancel: '=',
        environment: '=',
        configs: '=',
        update: '=',
        wizard: '='
      },
      templateUrl: '/app/environments/editor/s7-validation.html',
      controller: ValidationController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  ValidationController.$inject = ['ValidationMessage', '$scope'];
  function ValidationController( ValidationMessage, $scope){
    var vm            = this;
    vm.next           = next;
    vm.environment    = this.environment;
    vm.configs        = this.configs;
    vm.errorMessage   = 'Extended environment validation errors will be displayed here upon update.';
    vm.showDetails    = false;
    vm.errorStage     = null;
    vm.errorDetails   = null;
    vm.goToStage      = goToStage;
    activate();

    //////////

    function activate() {
      
      ValidationMessage.observeMessage().then(null, null, function(message){
        vm.wizard.stage = 'validation';

        vm.errorMessage = message.errorMessage;
        vm.errorStage = message.errorStage;
        vm.errorDetails = message.errorDetails;
        vm.wizard.error = message.errorStage;
        if(message.errorStage){
          vm.showDetails = true;
        }else{
          vm.showDetails = false;
        }

      });
    }
    
    function next() {
      vm.wizard.stage = 'taskdefs';
    }

    function prev() {
      vm.wizard.stage = 'info';
    }
    
    function goToStage() {
      vm.wizard.stage = vm.errorStage;
    }
  }
}());