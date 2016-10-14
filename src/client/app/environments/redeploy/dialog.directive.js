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

  Controller.$inject = [ '_', '$timeout', '$rootScope', '$location', 'Browse', 'EnvironmentStarter', 'Config', 'uiGridConstants' ];

  function Controller(_, $timeout, $rootScope, $location, Browse, EnvironmentStarter, Config, uiGridConstants) {
    var vm = this;
    vm.modalInstance      = this.modalInstance;
    vm.branches           = null;
    vm.builds             = null;
    vm.files              = ['Select a branch and build'];
    vm.launchKeys         = null;
    vm.litKeys            = null;
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
    vm.filesOk            = false;
    vm.hideFiles          = true;
    vm.poll               = null;
    vm.message            = null,
    vm.gridApi            = null;
    vm.click              = onFeatureKeyCheckClick;
    vm.featureGrid        = initFeatureGrid();
    vm.taskArray          = ['3-install-many'];
    vm.version            = null,
    vm.newLaunchKeys      = [];
    vm.rosettaStone       = {
      'DEVELOPMENT' : '0. Development',
      'ALPHA'       : '1. Portal01'   ,
      'BETA'        : '2. Demo'       ,
      'GAMMA'       : '3. OnDemand'   ,
      'RC'          : '4. SaaS'       ,
      'FAST'        : '1. Portal01'   ,   // deprecated
      'SLOW'        : '2. Demo'       ,   // deprecated
      'GLACIAL'     : '3. OnDemand'   ,   // deprecated
    },
    vm.orderedDisp        = ['RC', 'GAMMA', 'BETA', 'ALPHA', 'DEVELOPMENT'];
        
    activate();

    //////////

    function activate() {
      vm.featureGrid.appScopeProvider = vm;
      vm.regionId = $rootScope.routeParams.regionId;
      vm.tempEnv = angular.copy(vm.environment);
      vm.selectedBranch = parseBranchPath(vm.tempEnv.deployedBranch);

      vm.loadingBranches = true;
      Config.version({envId: vm.tempEnv.envId}, function(result) {
          vm.version = result.version;
          return;
      });
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
      vm.environment.$get(function(environment){
        vm.environment = environment;

        //handle local environments
        if(!environment.remoteId) {
          if(cb) {
            return cb();
          }
          return; 
        }

        if(vm.selectedTasks.length && vm.taskArray.indexOf(vm.selectedTasks[0].task) > -1 
          && (vm.environment.runstate != 'running' && vm.environment.runstate != 'busy')) {
          startSkytapEnvironment(cb);
          
        } 
        else if(vm.taskArray.indexOf(vm.selectedTasks[0].task) < 0) {
          if(cb) {
            return cb();
          }
          return; 
        } 
        else {
          pollWhileBusy(vm.environment, cb);
        }
      });

      if(vm.environment.updatePath !== "0") {
        vm.hideLaunchKeys = true;
      }
    }

    function startSkytapEnvironment(cb) {
      vm.isDeployed = false;
      vm.environment.$start();
      vm.environment.runstate = 'busy';

      if(!cb) {
        vm.message = 'Environment Busy';
      }
      pollWhileBusy(vm.environment, cb);
    }

    function pollWhileBusy(environment, cb) {
      if(environment.runstate === 'busy' || environment.status === 'deploying' || cb) {
        vm.poll = $timeout(function() {
          environment.$get(function(environment){
            if(environment.runstate == 'running' && environment.status != 'deploying') {
              vm.message = null;
              vm.isDeployed = true;
              if(cb) {
                cb();
              }
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

      saveLaunchKeys().$promise.then(function() {
        vm.environment.newLaunchKeys = vm.newLaunchKeys;
        
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
        , build  = vm.selectedBranch.build;
      return branch + (build ? '\\' + build : '');
    }

    function branchChanged() {
      // Timeout to try to fix ...

      if(vm.selectedBranch.branch) {
        vm.loadingBuilds = true;
        vm.selectedBranch.build = null;
        vm.launchKeys = null;
        vm.hideLaunchKeys = true;
        Browse.builds({regionId: vm.regionId, branch: vm.selectedBranch.branch }, function(builds) {
          vm.loadingBuilds = false;
          vm.loadingFiles = false;
          vm.filesOk = false;
          vm.builds = builds.sort(function(a, b) {
            return a.localeCompare(b);
          });
        });
      }
    }

    function buildChanged() {
      if(vm.selectedBranch.build) {
        vm.loadingFiles = true;
        vm.launchKeys = null;
        vm.hideLaunchKeys = true;
        var version = vm.version || '0.0.0.0'; //need to pass something even if there is nothing
        Browse.files({regionId: vm.regionId, branch: constructBranchPath(), version: version }, function(files) {
          vm.loadingFiles = false;
          vm.filesOk = files.length == 0 || files[0] !== 'OK';
          if(files.length > 0) {
            vm.hideFiles = false;  // too much noise.
          }
          else {
            vm.hideFiles = false;
            files.push('No files found....');
          }

          vm.files = files.sort(function(a, b) {
            return a.localeCompare(b);
          });
        }).$promise.then(function(){
          getLaunchKeysForBuild();
        });

      }
    }

    function getLaunchKeysForBuild() {
      Config.launchKeys({envId: vm.tempEnv.envId, branch: constructBranchPath() }, function(keys) {
        vm.launchKeys = filterKeysBasedOnEnvironmentDeploymentRing(keys);
        vm.hideLaunchKeys = vm.launchKeys === null || vm.launchKeys.length === 0;

        if(!vm.hideLaunchKeys && vm.environment.updatePath && vm.environment.updatePath !== "0") {
          vm.hideLaunchKeys = true;
        }


        return vm.launchKeys;
      }).$promise.then(function() {
        Config.litKeys({envId: vm.tempEnv.envId, branch: constructBranchPath() }, function(keys) {
           vm.litKeys = keys;
           return;
        }).$promise.then(function() {
          formatFeatureTreeData();
          return;
        });
      });
    }

    function saveLaunchKeys() {
      var filteredLaunchKeys = [],
        me = vm;

      me.newLaunchKeys = [];
      
      if(vm && vm.selectedBranch && vm.launchKeys) {
        vm.featureGrid.data.forEach(function(key) {
          vm.launchKeys.forEach(function(launchKey) {
            if((key.isActive || !key.selectable)  && key.name == launchKey.FeatureKey) {
              var tempLaunchKey = JSON.parse(JSON.stringify(launchKey));
              delete tempLaunchKey.$$hashKey;
              tempLaunchKey.isSetInDb = key.isSetInDb;
              filteredLaunchKeys.push(tempLaunchKey);

              if(!key.isSetInDb) {
                me.newLaunchKeys.push(tempLaunchKey);
              }
            }
          });
        });
      } 
      else {
        filteredLaunchKeys = [];
      }

      return Config.sendLaunchKeys({envId: vm.tempEnv.envId, launchKeys: filteredLaunchKeys});
    }
    
    function formatFeatureTreeData(){
     var treeData = [],
      data = [],
      writeoutNode = function(childArray, currentLevel, dataArray) {
        childArray.forEach(function(childNode) {
          if(childNode.children.length > 0) {
            childNode.$$treeLevel = currentLevel;
          }
          dataArray.push(childNode);
          writeoutNode(childNode.children, currentLevel + 1, dataArray);
        });
      };
         
      data = buildFeatureTreeDataObject(vm.launchKeys);
      writeoutNode(data, 0, treeData);
      vm.featureGrid.data = treeData;
      // Force window to handle resize to render properly
       $timeout( function() {
           vm.gridApi.core.handleWindowResize();
       });    
    }

    function filterKeysBasedOnEnvironmentDeploymentRing(launchKeys) {
      var keyFilter = vm.environment.updatePath,
        filteredKeys = [];        
      if(keyFilter) {
        filteredKeys = _.filter(launchKeys, function(k) {
          var mappedKey = vm.rosettaStone[k.KeyType.toUpperCase()];
          return mappedKey ? mappedKey[0] >= keyFilter[0] : false;
        });
      }

      return filteredKeys;
    }

    function buildFeatureTreeDataObject(launchKeys) {
      var rootNode = {
        'id': 'portal',       
        'name': 'Portal Database',
        'hideCheck': true,
        'selectable' : false,
        'children': []
      },
      groupedKeys = _.groupBy(launchKeys, function(x) { return x.KeyType; } );

      // Sort for display order 
      vm.orderedDisp.forEach(function(element) {
        var targetGroup = groupedKeys[element];
        if(targetGroup !== null && targetGroup !== undefined){
          if(targetGroup.length > 0) {
            rootNode.children.push(buildSubKeyLevelDataObject(targetGroup));
          }
        }
      }, this);
      return new Array(rootNode);
    }

    function buildSubKeyLevelDataObject(listOfKeys) {
      var rootLevelFeatureItem = listOfKeys.find( function(el){
          return el.KeyType !== null;
      });
      
      if(rootLevelFeatureItem === null){
        return;            
      }
      
      var IsKeyItemSelectable = false,
        rootItemChecked = false;
      
      if(rootLevelFeatureItem.KeyType.toUpperCase() === 'DEVELOPMENT'){
        IsKeyItemSelectable = true;
      }
      
      // Create the root item group
      var filterLevelItemRoot = {
        'id': rootLevelFeatureItem.KeyType,       
        'name': vm.rosettaStone[rootLevelFeatureItem.KeyType],
        'hideCheck': false,
        'selectable' : true,
        'isSelected': rootItemChecked,
        'children': [],
      };
      
      listOfKeys.forEach(function(keyItemDetail) {
        var isChecked = false;
        var isSetInDb = false;

        if (vm.litKeys.indexOf(keyItemDetail.FeatureKey) != -1) {
          isSetInDb = true;
          isChecked = true;
        } else if(vm.environment.updatePath && vm.environment.updatePath !== "0") {
          isChecked = true;
        }
        
        filterLevelItemRoot.children.push({
            'id': keyItemDetail.KeyType,
            'name': keyItemDetail.FeatureKey,
            'selectable' : IsKeyItemSelectable,
            'hideCheck': false,
            'isSetInDb': isSetInDb, // used to store the original state
            'isSelected': isChecked,
            'isActive' : isChecked,
            'description': keyItemDetail.Description,
            'children': []
          });
        });
            
        rootItemChecked = _.filter(filterLevelItemRoot.children, function(child) {
          return child.isSelected === false;
        }).length === 0;
            
        // Check the parent root node if necessary
        if (rootItemChecked) {
            filterLevelItemRoot.isActive = true;
            filterLevelItemRoot.selectable = false;
            filterLevelItemRoot.isSelected = true;
            if (rootLevelFeatureItem.KeyType.toUpperCase() === 'DEVELOPMENT') {
              _.each(filterLevelItemRoot.children, function(child) {child.selectable = false;});
            }
        }
        return filterLevelItemRoot;
    }

    function onFeatureKeyCheckClick(selectedNodeName, value) {
      vm.featureGrid.data.forEach(function(key) {
        if(key.name === selectedNodeName) {
          if(key.children !== null) {
            key.children.forEach(function(childNode) {
              if(value) {
                childNode.isActive = true;
              } 
              else {
                if (!childNode.isSetInDb) {
                  childNode.isActive = false;
                }
              }
            });
          }
        }
      });
      vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
    }
    
    vm.featureGrid.onRegisterApi = function (gridApi) {
      vm.gridApi = gridApi;

      vm.gridApi.grid.registerDataChangeCallback(function() {
       if(vm.gridApi.grid.treeBase.tree instanceof Array) {
         vm.gridApi.treeBase.expandAllRows();
        }
      });
    };

    function initFeatureGrid(){
      return {
        enableColumnMenus: false,
        showHeader: false,
        enableSorting: true,
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        enableFiltering: false,
        enableExpandAll: false,
        showTreeExpandNoChildren: true,
        treeRowHeaderAlwaysVisible: false,
        headerClass: 'ui-grid-noborder',
        width: 200,
        columnDefs: [
        { name: 'isActive', displayName: 'Active', type: 'boolean', cellTemplate: '<div ng-hide=row.entity.hideCheck><input type="checkbox" ng-model="row.entity.isActive"  ng-click="ui-grid.appScope.click(row.entity.name, row.entity.isActive)" ng-disabled=!row.entity.selectable></div>', enableColumnMenu: false, width:'25' , cellClass: 'ui-grid'},
        { name: 'name',enableHiding: false, enableColumnMenu: false, visible: true, pinnedLeft:true, width:'25%', cellClass: 'ui-grid' },
        { name: 'description', enableHiding: false, enableColumnMenu: false, visible: true, width:'*', cellClass: 'ui-grid' }
      ]};
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