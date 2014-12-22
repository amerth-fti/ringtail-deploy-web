(function() {
  'use strict';


  angular
    .module('app')
    .controller('MainController', MainController);

    MainController.$inject = [ '$scope', 'globals' ];
      
    function MainController($scope, globals) {
      $scope.globals = globals;    
    }

}());