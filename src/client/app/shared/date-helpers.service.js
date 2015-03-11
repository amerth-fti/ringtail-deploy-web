(function() {
  'use strict';

  angular
    .module('shared')
    .service('dateHelpers', dateHelpers);

  function dateHelpers() {
    return {
      quarterHour: function quarterHour(date) {
        var newDate = new Date(date.getTime());
        var minutes = newDate.getMinutes();
        newDate.setMinutes(Math.round(minutes/15) * 15);
        return newDate;
      },
      addMinutes: function addMinutes(date, minutes) {
        return new Date(date.getTime() + (minutes * 60 * 1000));
      },
      combineDateTime: function combineDateTime(date, time) {
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          time.getHours(),
          time.getMinutes(),
          0
        );
      }
    };
  }

}());