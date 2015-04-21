(function() {
  'use strict';

  angular
    .module('app.environments.starter')
    .directive('envRedeploy', directive);

  function directive() {
    return { 
      restrict: 'E',
      scope: {
        environment: '=',
        modalInstance: '='
      },
      templateUrl: '/app/environments/redeploy/dialog.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ '$rootScope', '$location', 'Browse', 'TaskDef' ];

  function Controller($rootScope, $location, Browse, TaskDef) {
    var vm = this;
    vm.modalInstance      = this.modalInstance;
    vm.branches           = null;
    vm.builds             = null;
    vm.duration           = 120;  
    vm.loadingBranches    = false;
    vm.loadingBuilds      = false;  
    vm.selectedTasks      = null;
    vm.selectedBranch     = null;
    vm.showAdvanced       = false;
    vm.hasRpf             = false;
    vm.keepRpfwInstalls   = null;    
    vm.wipeRpfWorkers     = null;
    vm.branchChanged      = branchChanged;    
    vm.cancel             = cancel;
    vm.rebuild            = rebuild;    
    vm.toggleAdvanced     = toggleAdvanced;
    vm.toggleSelectedTask = toggleSelectedTask;    
    vm.regionId           = null;

    activate();

    //////////

    function activate() {
      vm.regionId = $rootScope.routeParams.regionId;
      vm.tempEnv = angular.copy(vm.environment);
      vm.selectedBranch = parseBranchPath(vm.tempEnv.deployedBranch);

      vm.loadingBranches = true;
      Browse.branches({ regionId: vm.regionId }, function(branches) {
        vm.loadingBranches = false;
        vm.branches = branches.sort(function(a, b) {
          return a.localeCompare(b);
        });
        if(vm.selectedBranch.branch) {
          branchChanged();
        }
      });      

      if(vm.tempEnv.config && vm.tempEnv.config.taskdefs) {
        vm.selectedTasks = vm.tempEnv.config.taskdefs.slice(0);
      }  

      vm.hasRpf = hasRole(vm.tempEnv, [ 'ALLINONE', 'SKYTAP-ALLINONE', 'RPF-COORDINATOR', 'RPF-SUPERVISOR', 'SKYTAP-RPF-COORDINATOR', 'SKYTAP-RPF-SUPERVISOR']);      
    }
    
    function cancel() {
      vm.modalInstance.dismiss();
    }

    function rebuild() {      
      angular.copy(vm.tempEnv, vm.environment);
      vm.environment.deployedBranch = constructBranchPath();
      vm.environment.selectedTasks = vm.selectedTasks;
      
      // trigger the redeployment
      vm.environment.$redeploy({ keepRpfwInstalls: vm.keepRpfwInstalls, wipeRpfWorkers: vm.wipeRpfWorkers })
      // shut the dialog since we had success
      .then(function(environment) {
        vm.modalInstance.close(environment);
        return environment;
      })
      // transition to the job details
      .then(function(environment) {
        var path = '/app/jobs/' + environment.deployedJobId;          
        $location.path(path);
      });
    }

    function toggleAdvanced() {
      vm.showAdvanced = !vm.showAdvanced;
    }

    function toggleSelectedTask(taskdef) {
      var index = vm.selectedTasks.indexOf(taskdef);
      if(index > -1) {
        vm.selectedTasks.splice(index,1);
      } else {
        vm.selectedTasks.push(taskdef);
      }
    }    

    function parseBranchPath(branchPath) {
      var parts
        , result = {
            branch: null,
            build: null        
          }        
        ;
      if(branchPath) {
        parts = branchPath.split('\\');
        result.branch = parts[0];
        result.build = null;
      }
      return result;
    }

    function constructBranchPath() {
      var branch = vm.selectedBranch.branch
        , build  = vm.selectedBranch.build
        ;
      return branch + (build ? '\\' + build : '');
    }

    function branchChanged() {
      if(vm.selectedBranch.branch) {        
        vm.loadingBuilds = true;
        Browse.builds({regionId: vm.regionId, branch: vm.selectedBranch.branch }, function(builds) {
          vm.loadingBuilds = false;
          vm.builds = builds.sort(function(a, b) {
            return a.localeCompare(b);
          });
        });
      }
    }

    function hasRole(env, roles) {
      var result = false;
      if(env.config && env.config.taskdefs) {        
        roles.forEach(function(role) {
          result = result || !!TaskDef.getEnvTaskDefForRole(env, role);
        });        
      }
      return result;
    }
  }

}());