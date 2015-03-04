(function() {
  
  angular
    .module('app.environments.taskdefs')
    .directive('taskdefsList', taskdefsList);

  function taskdefsList() {
    return { 
      restrict: 'E',
      scope: {
        environment: '=',
        taskdefs: '='        
      },
      templateUrl: '/app/environments/taskdefs/list.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ '$scope', '$compile', '$element' ];

  function Controller($scope, $compile, $element) {
    var vm              = this;
    vm.environment      = this.environment;
    vm.taskdefs         = this.taskdefs;    
    vm.selectedTaskdef  = null;
    vm.selectedIndex    = 0;
    vm.editTaskdef      = editTaskdef;

    activate();

    //////////

    function activate() {
      $scope.$watch('vm.taskdefs', function(taskdefs) {
        if(taskdefs) {
          editTaskdef(taskdefs[0], 0);
        }
      });
    }

    function editTaskdef(taskdef, index) {
      var scope = $scope.$new()
        , el
        ;        
      vm.selectedTaskdef  = taskdef;      
      vm.selectedIndex    = index;

      if(taskdef.task === 'parallel' || taskdef.task === '3-custom-ringtail') {
        el = $compile('<taskdef-ringtail environment="vm.environment"></tasdef-ringtail>')(scope);        
      } else {
        el = $compile('<taskdef-raw environment="vm.environment" taskdef="vm.selectedTaskdef"></taskdef-raw>')(scope);
      }
      angular.element($element[0].querySelector('.taskdef-editor-container')).html(el);

    }
  }

}());