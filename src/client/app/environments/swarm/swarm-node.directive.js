(function() {
  'use strict';

  angular
    .module('app.environments.swarm')
    .directive('swarmNodeDetails', swarmNodeDetails);

  function swarmNodeDetails() {
    return {
      restrict: 'E',
      scope: {
        node: '='
      },
      templateUrl: '/app/environments/swarm/swarm-node.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ '$scope','ValidationMessage' ];

  function Controller($scope, ValidationMessage) {
    var vm         = this;
    vm.node        = this.node;

    activate();

    //////////

    function activate() {
      console.log('node activated');
    }

  }

}());