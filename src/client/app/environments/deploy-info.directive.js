(function() {
  'use strict';

  angular
    .module('app.environments')
    .directive('deployinfo', deployinfo);

  function deployinfo() {
    return { 
      restrict: 'E',
      scope: {
        environment: '='
      },
      templateUrl: '/app/environments/deploy-info.directive.html',
      controller: DeployInfoController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  DeployInfoController.$inject = [ '$scope', 'dateHelpers' ];

  function DeployInfoController($scope, dateHelpers) {
    var vm = this;    
    vm.format           = 'dd-MMMM-yyyy';
    vm.mindate          = new Date();
    vm.opened           = false;
    vm.openCalendar     = openCalendar;
    vm.dateTimeChanged  = dateTimeChanged;
    vm.environment      = this.environment;
    
    activate();

    //////////

    function activate() {
      vm.environment.deployedBy       = null;
      vm.environment.deployedUntil    = null;
      vm.environment.deployedNotes    = null;

      $scope.$parent.$watch('vm.duration', durationChanged);      
      durationChanged(15);
    }

    function openCalendar($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.opened = true;
    }

    function durationChanged(duration) {
      var untilDate = dateHelpers.quarterHour(new Date());
      untilDate     = dateHelpers.addMinutes(untilDate, duration);
      vm.date       = untilDate;
      vm.time       = untilDate;
      dateTimeChanged();
    }

    function dateTimeChanged() {
      var date = new Date(vm.date)
        , time = vm.time
        , newDate;
      newDate = dateHelpers.combineDateTime(date, time);
      vm.environment.deployedUntil = newDate.toUTCString();
    }
  }

}());

