(function () {
  'use strict';

  angular
    .module('app')
    .controller('JobDetailsController', JobDetailsController);

  JobDetailsController.$inject = [ '$routeParams', 'Job' ];

  function JobDetailsController($routeParams, Job) {    
    var vm          = this;
    vm.job          = null;
    vm.selectedTask = null;
    vm.currentTask  = null;
    vm.selectTask   = selectTask;
    
    activate();
    
    //////////
    
    function activate() {
      return Job.get({ jobId: $routeParams.jobId }, loadJobComplete);
    }

    function loadJobComplete(result) {
      vm.job = result;
      vm.currentTask = vm.selectedTask;
      
      if(!vm.currentTask) {
        vm.job.tasks.forEach(function(task) {
          if(task.status === 'Running') { 
            vm.currentTask = task; 
          }
        });
      }
      
      if(!vm.currentTask) {
        vm.currentTask = vm.job.tasks[0];
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

    function selectTask(task) {
      vm.selectedTask = task;
      vm.currentTask = task;
    }
  }


}());
