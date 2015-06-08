(function() {
  
  angular
    .module('app.environments.config')
    .directive('configList', list);

  function list() {
    return { 
      restrict: 'E',
      scope: {
        environment: '=',
        taskdefs: '='        
      },
      templateUrl: '/app/environments/config/list.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ 'Config', 'ConfigEditor' ];

  function Controller(Config, ConfigEditor) {
    var vm         = this;
    vm.environment = this.environment;
    vm.configs     = null;
    vm.edit        = edit;

    activate();

    //////////

    function activate() {
      vm.configs = Config.findByEnv({ envId: vm.environment.envId });
    }

    function edit(config) {      
      ConfigEditor.open(config, vm.environment.host);
    }

    function remove(config) {
      // delete the config
      
      // find in list and remove      
    }
  }

}());