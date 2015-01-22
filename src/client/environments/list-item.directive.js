(function() {
  'use strict';
  
  angular
    .module('app.environments')
    .directive('listItem', listItem);
  
  function listItem() {
    return { 
      restrict: 'E',
      scope: {
        environment: '='
      },
      templateUrl: '/app/environments/list-item.directive.html',
      controller: ListItemController,
      controllerAs: 'vm'
    };
  }
  
  ListItemController.$inject = [ '$scope', '$modal','$location', '$timeout', 'config', 'EnvironmentEditor' ];
  
  function ListItemController($scope, $modal, $location, $timeout, config, EnvironmentEditor) {
    var vm = this;
    vm.enableDeploy = config.enableDeployment;
    vm.environment  = $scope.environment; 
    vm.showStart    = false;
    vm.showPause    = false;
    vm.showBuildNotes = false;
    vm.status       = null;
    vm.show         = false;
    vm.edit         = edit;
    vm.initialize   = initialize;
    vm.pause        = pause;
    vm.redeploy     = redeploy;
    vm.reset        = reset;
    vm.start        = start;
    
    activate($scope.environment);
    
    //////////
    
    function activate(environment) {    
      var runstate      = environment.runstate;
      vm.environment    = environment;
      vm.showStart      = runstate === 'suspended' || runstate === 'stopped';
      vm.showPause      = runstate === 'running';
      vm.showInitialize = environment.status === 'initialize';
      vm.showButtons    = environment.status === 'deployed';
      vm.showDeployLink = environment.status === 'deploying';
      vm.showBuildNotes = environment.machines
        .map(function(m) { return !!m.installNotes; })
        .reduce(function(prev, cur) { return prev || cur; }, false);
      
      pollWhileBusy(environment);
    }

    function pollWhileBusy(environment) {
      if(environment.runstate === 'busy' || environment.status === 'deploying') {
        $timeout(function() {
          environment.$get(activate);
        }, 15000);
      }
    }

    function start() {
      var modal = $modal.open({
        templateUrl: '/app/environments/start-dialog.html',
        controller: 'EnvironmentStartController',
        controllerAs: 'vm',
        resolve: {
          environment: function() { 
            return vm.environment;
          }
        }
      });

      modal.result.then(function(startinfo) {
        var qs = {
          suspend_on_idle: startinfo.duration * 60,
        };
        vm.environment.$start(qs, activate);
      });
    }

    function pause() {
      vm.environment.$pause(activate);
    }

    function redeploy() {
      var modal = $modal.open({
        templateUrl: '/app/environments/redeploy-dialog.html',
        controller: 'EnvironmentRedeployController',
        controllerAs: 'vm',
        resolve: {
          environment: function() {
            return vm.environment;
          }
        }
      });

      modal.result.then(function() {
        vm.environment.$redeploy()
        .then(function(environment) {
          var path = '/app/jobs/' + environment.deployedJobId;          
          $location.path(path);
        });     
      });
    }

    function reset() {
      vm.environment.$reset();
    }

    function edit() {
      EnvironmentEditor.open(vm.environment);
    }

    function initialize() {
      vm.environment.user_data.contents = JSON.stringify(config.intialize, null, 2);
      vm.environment.$update(activate);
    }
  }
  
}());