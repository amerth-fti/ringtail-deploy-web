(function() {
  'use strict';

  angular
    .module('app.regions')
    .directive('regionEnvironmentEdit', RegionEnvironmentEditList);

  function RegionEnvironmentEditList() {
    return { 
      restrict: 'E',
      scope: {
        regionId: '='        
      },
      templateUrl: '/app/regions/environment-edit.html',
      controller: RegionEnvironmentEditListController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  RegionEnvironmentEditListController.$inject = ['Region', 'Environment', '$location'];

  function RegionEnvironmentEditListController(Region, Environment, $location) {
    var vm = this;
    vm.region         = null;
    vm.environments   = null;
    vm.page           = 1;
    vm.pagesize       = 100;
    vm.total          = 0;
    vm.lastpage       = 1;
    vm.pagingActive   = false;
    vm.loadPage       = loadPage;
    vm.remove         = remove;
    vm.cancel         = cancel;
    vm.showDelete     = false;

    var deleteCounter = 0;
    var environmentCount = 0;
    
    activate();

    //////////
    
    function activate() {
      vm.region = Region.get({ regionId: vm.regionId });
      vm.loadPage();
    }

    function loadPage() {
      Environment.region({ regionId: vm.regionId, page: vm.page, pagesize: vm.pagesize }, function(envs, headers) {
        if(envs && envs.length > 0) {
          vm.showDelete = true;
        }
        
        vm.environments = envs;
        vm.total = parseInt(headers('X-Paging-Total'));
        vm.lastpage = parseInt(headers('X-Paging-LastPage'));
        vm.pagingActive = vm.lastpage > 1;
      });
    }

    function isComplete(){
      deleteCounter++;

      if(deleteCounter >= environmentCount) {
        navigateToRegion();
      }
    }

    function navigateToRegion() {
      var path = '/app/regions/' + vm.region.regionId;
       
      $location.path(path);
    }

    function remove() {
      var checkedEnvironments = $('[name="chkEnvs"]:checked');
      environmentCount = checkedEnvironments.length;

      checkedEnvironments.each(function(){
        var chk = $(this);
        var envId = chk.data('id');

        vm.environments.forEach(function(environment){
          if(envId == environment.envId) {
            environment.$remove(isComplete);
          }
        });
      });
    }

    function cancel() {
      navigateToRegion();
    }
  }

}());