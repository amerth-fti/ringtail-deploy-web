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

  Controller.$inject = [ '$timeout', '$rootScope', '$location', 'Browse', 'EnvironmentStarter', 'Config' ];

  function Controller($timeout, $rootScope, $location, Browse, EnvironmentStarter, Config) {
    var vm = this;
    vm.modalInstance      = this.modalInstance;
    vm.branches           = null;
    vm.builds             = null;
    vm.files              = ['Select a branch and build'];
    vm.launchKeys         = null;
    vm.duration           = 120;
    vm.loadingBranches    = false;
    vm.loadingBuilds      = false;
    vm.loadingFiles       = false;
    vm.loadingLaunchKeys  = false;
    vm.selectedTasks      = null;
    vm.selectedBranch     = null;
    vm.showAdvanced       = false;
    vm.hideLaunchKeys     = true;
    vm.hasRpf             = false;
    vm.keepRpfwInstalls   = null;
    vm.wipeRpfWorkers     = null;
    vm.branchChanged      = branchChanged;
    vm.buildChanged       = buildChanged;
    vm.cancel             = cancel;
    vm.rebuild            = rebuild;
    vm.toggleAdvanced     = toggleAdvanced;
    vm.toggleSelectedTask = toggleSelectedTask;
    vm.regionId           = null;
    vm.filesInvalid       = false;
    vm.isDeployed         = true;
    vm.fileCount          = 0;
    vm.hideFiles          = true;
    vm.poll               = null;
    vm.message            = null;
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

      checkEnvironmentStatus();

      vm.hasRpf = hasRole(vm.tempEnv, [ 'ALLINONE', 'SKYTAP-ALLINONE', 'RPF-COORDINATOR', 'RPF-SUPERVISOR', 'SKYTAP-RPF-COORDINATOR', 'SKYTAP-RPF-SUPERVISOR']);
    }

    function checkEnvironmentStatus(cb) {
      var taskArray = ['3-install-many'];

      vm.environment.$get(function(environment){
        vm.environment = environment;

        if(vm.selectedTasks.length && taskArray.indexOf(vm.selectedTasks[0].task) > -1 
          && (vm.environment.runstate != 'running' && vm.environment.runstate != 'busy')) {
          startSkytapEnvironment(cb);
        } else {
          pollWhileBusy(vm.environment, cb);
        }
      });
    }

    function startSkytapEnvironment(cb) {
      vm.isDeployed = false;
      vm.environment.$start();
      vm.environment.runstate = 'busy';

      if(!cb) vm.message = 'Environment Busy';
      pollWhileBusy(vm.environment, cb);
    }

    function pollWhileBusy(environment, cb) {
      if(environment.runstate === 'busy' || environment.status === 'deploying' || cb) {
        vm.poll = $timeout(function() {
          environment.$get(function(environment){
            if(environment.runstate == 'running' && environment.status != 'deploying') {
              vm.message = null;
              vm.isDeployed = true;
              if(cb) cb();  
              return;
            };

          vm.message = 'Environment Busy';
          pollWhileBusy(environment, cb);
          });
        }, 5000);
      } else if(environment.runstate == 'running') {
        vm.message = null;
        vm.isDeployed = true; 
      }
    }

    function cancel() {
      vm.modalInstance.dismiss();
    }

    function rebuild() {
      vm.message = 'Processing';
      checkEnvironmentStatus(doRebuild);
    }

    function doRebuild() {
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
        vm.selectedBranch.build = null;
        Browse.builds({regionId: vm.regionId, branch: vm.selectedBranch.branch }, function(builds) {
          vm.loadingBuilds = false;
          vm.loadingFiles = false;
          vm.fileCount = 0;
          vm.builds = builds.sort(function(a, b) {
            return a.localeCompare(b);
          });
        });
      }
    }

    function buildChanged() {
      if(vm.selectedBranch.build) {
        vm.loadingFiles = true;
        getLaunchKeysForBuild();
        Browse.files({regionId: vm.regionId, branch: constructBranchPath() }, function(files) {
          vm.loadingFiles = false;
          vm.fileCount = files.length;
          if(files.length > 0) {
            vm.hideFiles = false;
          }
          else {
            vm.hideFiles = false;
            files.push('No files found....');
          }

          vm.files = files.sort(function(a, b) {
            return a.localeCompare(b);
          });
        });
      }
    }

    function getLaunchKeysForBuild() {
      if(vm.hideLaunchKeys === true) {
        return;
      }
      
      Config.launchKeys({envId: vm.tempEnv.envId, branch: constructBranchPath() }, function(files) {
      });
    }      

    function launchKeySelection() {
    }    

    function hasRole(env, roles) {
      var result = false;

      env.machines.forEach(function(machine) {
        roles.forEach(function(role) {
          result = result || machine.role === role;
        });
      });

      return result;
    }
  }

}());