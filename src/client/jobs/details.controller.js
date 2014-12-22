(function () {
  'use strict';

  angular
    .module('app')
    .controller('JobDetailsController', JobDetailsController);

  JobDetailsController.$inject = [ '$scope', '$routeParams', '$modal', 'Job' ];

  function JobDetailsController($scope, $routeParams, $modal, Job) {    
    $scope.job = Job.get({jobId: $routeParams.jobId}, loadJobComplete);    

    function loadJobComplete(result) {      
      $scope.job = result;      
      $scope.job.elapsed = ($scope.job.stopped ? new Date($scope.job.stopped) : new Date()) - new Date($scope.job.started);      

      $scope.selectedTask = null;
      result.tasks.forEach(function(task) {
        if(task.status === 'Running') {
          $scope.selectedTask = task;
        }
      });
      
      if($scope.selectedTask == null) {
        $scope.selectedTask = result.tasks[0];
      }

      pollWhileRunning(result);
    }

    function pollWhileRunning(job) {
      if(job.status === 'Running') {
        setTimeout(function() {
          job.$get(loadJobComplete);
        }, 5000);
      }
    }

    $scope.taskClick = function(task) {
      $scope.selectedTask = task;
    }
  }


}());
