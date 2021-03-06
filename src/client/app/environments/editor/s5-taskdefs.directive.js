(function() {
  'use strict';

  angular
    .module('app.environments.editor')
    .directive('envwizardTaskdefs', envwizardConfig);

  function envwizardConfig() {
    return {
      restrict: 'E',
      scope: {
        cancel: '=',
        create: '=',
        environment: '=',
        update: '=',
        wizard: '=',
      },
      templateUrl: '/app/environments/editor/s5-taskdefs.html',
      controller: DirectiveController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  DirectiveController.$inject = [ '$scope', 'TaskDef' ];

  function DirectiveController($scope, TaskDef) {
    var vm            = this;
    vm.config         = null;
    vm.configChanged  = configChanged;
    vm.prev           = prev;
    vm.invalid        = false;
    vm.simple         = true;
    vm.addTask        = addTask;

    activate();

    //////////

    function activate() {
      // initialize configuration on first load
      $scope.$watch('vm.wizard.stage', function(stage) {
        if(stage === 'taskdefs' && !vm.environment.config) {
          vm.environment.config = TaskDef.create(vm.environment);
        }
      });

      // handle updates from editor
      $scope.$watch('vm.environment.config', function(config) {
        if(config) {
          vm.config = JSON.stringify(config, null, 2);
        }
      }, true);
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

    function addTask() {
      TaskDef.addTask(vm.environment);
    }


  }

}());