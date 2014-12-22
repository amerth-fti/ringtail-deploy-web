(function () {
  'use strict';

  angular
    .module('app')
    .controller('TaskDetailsController', TaskDetailsController);

  TaskDetailsController.$inject = [ '$scope' ];

  function TaskDetailsController($scope) {
    console.log('TaskDetailsCtrl');
    
    $scope.$parent.job.$promise
    .then(function() {
      $scope.$watch('selectedTask', onTaskUpdate);
    });

    $scope.selectedTab = 0;

    function onTaskUpdate(rootTask) {
      $scope.tabs = [];

      $scope.tabs.push({
        title: rootTask.name,
        task: rootTask,
        active: $scope.selectedTab === 0,
        disabled: false
      });

      if(rootTask.tasks) {
        rootTask.tasks.forEach(function(task, idx) {
          $scope.tabs.push({
            title: task.name,
            task: task,
            active: $scope.selectedTab === idx + 1,
            disabled: false
          });
        });       
      }
    }

    $scope.tabSelected = function(index) {      
      $scope.selectedTab = index;
    }
  }

}());
