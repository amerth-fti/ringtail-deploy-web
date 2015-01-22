(function() {
  'use strict';

  angular
    .module('app.environments.editor')
    .factory('Wizard', WizardFactory);

  WizardFactory.$inject = [ ];
  
  function WizardFactory() {    
    return Wizard;  
  }
  
  function Wizard(mode) {
    this.mode = mode || 'new';
    this.stage = mode === 'new' ? 'method' : 'info';
  }

  Wizard.prototype.show = function(stage) {
    this.stage = stage;
  };
  
}());