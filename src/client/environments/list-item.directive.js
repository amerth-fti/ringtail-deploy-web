(function() {
  'use strict';
  
  angular
    .module('app')
    .directive('listItem', listItem);
  
  function listItem() {
    return { 
      restrict: 'E',
      scope: {
        environment: '='
      },
      templateUrl: 'client/environments/list-item.directive.html',
      controller: ListItemController,
      controllerAs: 'vm'
    };
  }
  
  ListItemController.$inject = [ '$scope', '$modal','$location', 'config' ];
  
  function ListItemController($scope, $modal, $location, config) {
    var vm = this;
    vm.enableDeploy = config.enableDeployment;
    vm.environment  = $scope.environment; 
    vm.showStart    = false;
    vm.showPause    = false;
    vm.status       = null;
    vm.show         = false;
    vm.configure    = configure;
    vm.initialize   = initialize;
    vm.pause        = pause;
    vm.redeploy     = redeploy;
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
      vm.showDeployLnk  = environment.status === 'deploying';
      
      pollWhileBusy(environment);
    }

    function pollWhileBusy(environment) {
      if(environment.runstate === 'busy' || environment.status === 'deploying') {
        setTimeout(function() {
          environment.$get(activate);
        }, 15000);
      }
    }

    function start() {
      var modal = $modal.open({
        templateUrl: 'client/environments/start-dialog.html',
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
        templateUrl: 'client/environments/redeploy-dialog.html',
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
          var path = '/jobs/' + environment.deployedJobId;          
          $location.path(path);
        });     
      });
    }

    function configure() {      
      var modal = $modal.open({
        size: 'lg',
        templateUrl: 'client/environments/config-dialog.html',
        controller: 'EnvironmentConfigController',
        controllerAs: 'vm',
        resolve: {
          environment: function() {
            return vm.environment;
          }
        }
      });

      modal.result.then(function() {
        vm.environment.$update(activate);
      });
    }

    function initialize() {
      vm.environment.user_data.contents = JSON.stringify(config.intialize, null, 2);
      vm.environment.$update(activate);
    }
  }
  
}());