(function() {
  'use strict';

  angular
    .module('app.environments.editor')
    .service('ValidationMessage', function($q){
      var self = this,
      defer = $q.defer();
      this.message = null;
      
      this.observeMessage = function() {
        return defer.promise;
      };
      
      this.setMessage = function(wizardStage, errorMessage, details ) {
        self.message = {
          errorStage: wizardStage,
          errorMessage: errorMessage,
          errorDetails: details
        };
        defer.notify(self.message);
      };

      this.clearMessage = function( ) {
        self.message = {
          errorStage: '',
          errorMessage: '',
          errorDetails: ''
        };
        defer.notify(self.message);
      };
    });
    
}());