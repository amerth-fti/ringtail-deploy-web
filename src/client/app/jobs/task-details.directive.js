(function () {
  'use strict';

  angular
    .module('app')
    .directive('taskDetails', taskDetails)
    .controller('TaskDetailsController', TaskDetailsController);

  function taskDetails() {
    return { 
      restrict: 'E',
      scope: {
        task: '='
      },
      templateUrl: '/app/jobs/task-details.directive.html',
      controller: 'TaskDetailsController',
      controllerAs: 'vm'
    };
  }
  
  TaskDetailsController.$inject = [ '$scope' ];

  function TaskDetailsController($scope) {
    var vm          = this;
    vm.selectedTab  = 0;
    vm.tabs         = [];
    vm.selectTab    = selectTab;
    
    activate();
    
    //////////
    
    function activate() {
      $scope.$parent.$watch('vm.currentTask', onTaskUpdate);
    }


    function onTaskUpdate(rootTask) {
      if(rootTask) {        
        vm.tabs = [];

        vm.tabs.push({
          title: rootTask.name,
          task: rootTask,
          active: vm.selectedTab === 0,
          disabled: false
        });

        if(rootTask.tasks) {
          rootTask.tasks.forEach(function(task, idx) {
            vm.tabs.push({
              title: task.name,
              task: task,
              active: vm.selectedTab === idx + 1,
              disabled: false
            });
          });       
        }
      }
    }

    function selectTab(index) {      
      vm.selectedTab = index;
    }
  }

}());
