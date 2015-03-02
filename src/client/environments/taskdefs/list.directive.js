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
    vm.selectedTaskdef  = 0;    
    vm.editTaskdef      = editTaskdef;

    activate();

    //////////

    function activate() {      
    }

    function editTaskdef(taskdef, index) {
      var scope = $scope.$new()
        , el
        ;        
      vm.selectedTaskdef  = index;      

      // TODO - break into factory
      if(taskdef.task === 'parallel') {
        el = $compile('<taskdef-ringtail environment="vm.environment"></tasdef-ringtail>')(scope);
        angular.element($element[0].querySelector('.taskdef-editor-container')).html(el);
      } else {
        // TODO - create raw editor that gets toggled
      }

    }
  }

}());