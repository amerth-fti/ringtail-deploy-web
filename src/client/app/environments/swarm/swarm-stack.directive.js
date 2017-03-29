(function() {
  'use strict';

  angular
    .module('app.environments.swarm')
    .directive('swarmStack', swarmStack);

  function swarmStack() {
    return {
      restrict: 'E',
      scope: {
        environment: '=',
        stack: '='
      },
      templateUrl: '/app/environments/swarm/swarm-stack.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ 'Swarm' ];

  function Controller(Swarm) {
    var vm               = this;
    vm.stack             = this.stack;
    vm.environemnt       = this.environment;

    activate();

    //////////

    function activate() {

    }

  }

}());