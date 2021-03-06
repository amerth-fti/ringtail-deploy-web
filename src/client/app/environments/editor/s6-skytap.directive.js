(function() {
  'use strict';

  angular
    .module('app.environments.editor')
    .directive('envwizardSkytap', envwizardSkytap);

  function envwizardSkytap() {
    return {
      restrict: 'E',
      scope: {
        cancel: '=',
        environment: '=',
        wizard: '=',
      },
      templateUrl: '/app/environments/editor/s6-skytap.html',
      controller: NewEnvironmentSkytapController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  NewEnvironmentSkytapController.$inject = [ 'SkytapEnvironment', 'environmentFactory' ];

  function NewEnvironmentSkytapController(SkytapEnvironment, environmentFactory) {
    var vm = this;
    vm.pageData     = null;
    vm.currentPage  = 1;
    vm.environments = null;
    vm.pagingActive = false;
    vm.pageSize     = 10;
    vm.selected     = null;
    vm.totalItems   = 0;

    vm.next         = next;
    vm.pageChanged  = pageChanged;
    vm.prev         = prev;

    activate();

    //////////

    function activate() {
      SkytapEnvironment.query(function(environments) {
        vm.environments = sortEnvs(environments);
        vm.totalItems = environments.length;
        vm.pagingActive = vm.totalItems > vm.pageSize;
        vm.selected = environments[0];
        pageChanged();
      });
    }

    function next() {
      SkytapEnvironment.get({ id: vm.selected.id })
        .$promise
        .then(function(env) {
          var originalEnvId = vm.environment.envId;
          vm.environment = environmentFactory.fromSkytap(env);
          vm.environment.envId = originalEnvId;
          vm.wizard.stage = 'info';
        });
    }

    function pageChanged() {
      var pageStart = (vm.currentPage - 1) * vm.pageSize;
      vm.pageData = vm.environments.slice(pageStart, pageStart + vm.pageSize);
    }

    function prev() {
      vm.wizard.stage = 'method';
    }

    function sortEnvs(envs) {
      return envs.sort(function(a, b) {
        var result;
        if(String.prototype.localeCompare) {
          result = a.name.localeCompare(b.name);
        } else {
          if(a.name > b.name) {
            result = 1;
          } else if (a.name < b.name) {
            result = -1;
          } else {
            result = 0;
          }
        }
        return result;
      });

    }
  }

}());