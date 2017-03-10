(function() {
  'use strict';

  angular
    .module('app.environments.swarm')
    .directive('swarmNodeDetails', swarmNodeDetails);

  function swarmNodeDetails() {
    return {
      restrict: 'E',
      scope: {
        environment: '=',
        node: '='
      },
      templateUrl: '/app/environments/swarm/swarm-node.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ '$scope','ValidationMessage', 'SwarmNode' ];

  function Controller($scope, ValidationMessage, SwarmNode) {
    var vm          = this;
    vm.environment  = this.environment;
    vm.node         = this.node;
    vm.roles        = [{ name: 'elasticsearch_v5' }, { name: 'mongo_v3' }, { name: 'services' } ];
    vm.roleOptions  = [];
    vm.selectedRole = null;
    vm.roleSelected = roleSelected;
    vm.removeRole   = removeRole;

    activate();

    //////////

    function activate() {
      getRoleOptions();
    }

    function getRoleOptions() {
      vm.roleOptions = vm.roles.slice();
      vm.roleOptions = vm.roleOptions.filter(p => !(vm.node.Spec.Labels && vm.node.Spec.Labels[p.name]));
    }

    function roleSelected(role) {
      let body = {
        swarmhost: vm.environment.swarmhost,
        nodeId: vm.node.ID,
        label: vm.selectedRole,
        value: 'true',
        sshKey: vm.environment.swarmSshKey,
        sshUser: vm.environment.swarmSshUser,
      };
      SwarmNode.addLabel({}, body).$promise
        .then((node) => {
          vm.node = node;
          getRoleOptions();
          vm.selectedRole = '';
        });
    }

    function removeRole(role) {
      let body = {
        swarmhost: vm.environment.swarmhost,
        nodeId: vm.node.ID,
        label: role,
      };
      SwarmNode.removeLabel({}, body).$promise
        .then((node) => {
          vm.node = node;
          getRoleOptions();
        });
    }

  }

}());