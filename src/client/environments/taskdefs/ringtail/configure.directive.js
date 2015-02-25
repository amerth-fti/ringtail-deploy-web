(function() {
  'use strict';

  angular
    .module('app.environments.taskdefs.ringtail')
    .directive('taskdefRingtail', taskdefRingtail);

  function taskdefRingtail() {
    return { 
      restrict: 'E',
      scope: {
        taskdef: '='     
      },
      templateUrl: '/app/environments/taskdefs/ringtail/configure.html',
      controller: TaskdefRingtailController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  TaskdefRingtailController.$inject = [ 'RingtailConfig', 'Role' ];

  function TaskdefRingtailController(RingtailConfig, Role) {
    var vm = this;        
    
    activate();

    //////////

    function activate() {
    }  
  }

}());

