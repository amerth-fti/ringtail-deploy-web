(function() {
  'use strict';

  angular
    .module('app.environments.taskdefs.raw')
    .directive('taskdefRaw', taskdefRaw);

  function taskdefRaw() {
    return { 
      restrict: 'E',
      scope: {
        environment: '=',
        taskdef: '='
      },
      templateUrl: '/app/environments/taskdefs/raw/editor.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  Controller.$inject = [ ];

  function Controller() {
    var vm            = this;
    vm.environment    = this.environment;    
    vm.taskdef        = this.taskdef;
    vm.taskdefJson    = null;    
    vm.invalid        = false;
    vm.jsonChanged    = jsonChanged;

    activate();

    //////////

    function activate() { 
      var temp = angular.copy(vm.taskdef);     
      vm.taskdefJson = JSON.stringify(temp, null, 2);
    } 

    function jsonChanged() {
      try 
      {
        var temp = JSON.parse(vm.taskdefJson);
        angular.copy(temp, vm.taskdef);
        vm.invalid = false;
      }
      catch(ex) {
        vm.invalid = true;
      }
    }

  }

}());

