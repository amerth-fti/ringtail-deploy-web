(function() {
  'use strict';

  angular
    .module('app.swarm')
    .directive('swarmStack', swarmStack);

  function swarmStack() {
    return {
      restrict: 'E',
      scope: {
        environment: '=',
        stack: '='
      },
      templateUrl: '/app/swarm/swarm-stack.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ '$scope', 'Swarm' ];

  function Controller($scope, Swarm) {
    var vm         = this;
    vm.stack       = this.stack;
    vm.environemnt = this.environment;
    vm.deploying   = false;
    vm.deploy      = deploy;

    activate();

    //////////

    function activate() {

    }

    function deploy() {
      let eventData = { type: 'stack', id: vm.stack.id };
      $scope.$emit('deploy_started', eventData);
      vm.deploying = true;
      Swarm
        .deployStack({
          swarmhost: vm.environment.swarmhost,
          accessKeyId: vm.environment.accessKeyId,
          secretAccessKey: vm.environment.secretAccessKey,
          stack: this.stack.id,
        })
        .$promise
        .then(function(res) {
          $scope.$emit('deploy_completed', eventData);
          vm.deploying = false;
        })
        .catch(function(res) {
          $scope.$emit('deploy_completed', eventData);
          vm.deploying = false;
          setTimeout(alert('Deployment failed with ' + res.statusText));
        });
    }

  }

}());