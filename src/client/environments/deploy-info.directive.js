(function() {
  'use strict'

  angular
    .module('app')
    .directive('deployinfo', deployinfo);

  function deployinfo() {
    return { 
      restrict: 'E',
      scope: {
        deployinfo: '=',
        duration: '=?'
      },
      templateUrl: 'client/environments/deploy-info.directive.html',
      controller: DeployInfoController
    };
  }

  DeployInfoController.$inject = [ '$scope', '$filter', 'dateHelpers' ];

  function DeployInfoController($scope, $filter, dateHelpers) {
    $scope.duration = $scope.duration || 120;
    $scope.mindate  = new Date();
    $scope.format   = 'dd-MMMM-yyyy';
    $scope.opened   = false;  

    $scope.$watch('duration', updateDateTime);

    function updateDateTime() {
      var untilDate = dateHelpers.quarterHour(new Date());
      untilDate     = dateHelpers.addMinutes(untilDate, $scope.duration);
      $scope.date   = untilDate;
      $scope.time   = untilDate;
    }

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    }

    $scope.dateTimeChanged = function() {
      var date = new Date($scope.date)
        , time = $scope.time
        , newDate;
      newDate = dateHelpers.combineDateTime(date, time);
      $scope.deployinfo.until = newDate.toUTCString();
    }

    updateDateTime();
    $scope.dateTimeChanged();      
  }

}());

