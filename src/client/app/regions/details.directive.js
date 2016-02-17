(function() {
  'use strict';

  angular
    .module('app.regions')
    .directive('regionDetails', regionDetails);

  function regionDetails() {
    return {
      restrict: 'E',
      scope: {
        regionId: '='
      },
      templateUrl: '/app/regions/details.html',
      controller: RegionDetailsController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  RegionDetailsController.$inject = [ 'Region', 'Environment', 'EnvironmentEditor' ];

  function RegionDetailsController(Region, Environment, EnvironmentEditor) {
    var vm            = this;
    vm.region         = null;
    vm.environments   = null;
    vm.page           = 1;
    vm.pagesize       = 100;
    vm.total          = 0;
    vm.lastpage       = 1;
    vm.pagingActive   = false;
    vm.newEnvironment = newEnvironment;
    vm.loadPage       = loadPage;

    activate();

    //////////

    function activate() {
      vm.region = Region.get({ regionId: vm.regionId });
      vm.loadPage();
    }

    function loadPage() {
      Environment.region({ regionId: vm.regionId, page: vm.page, pagesize: vm.pagesize }, function(envs, headers) {
        vm.environments = envs;
        vm.total = parseInt(headers('X-Paging-Total'));
        vm.lastpage = parseInt(headers('X-Paging-LastPage'));
        vm.pagingActive = vm.lastpage > 1;
      });
    }

    function newEnvironment() {
      return EnvironmentEditor.open()
        .result
        .then(function(env) {
          vm.environments.push(env);
        });
    }
  }

}());