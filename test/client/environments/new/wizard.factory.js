
describe('Wizard', function() {
  beforeEach(module('app'));
  beforeEach(module('app.environments'));
  beforeEach(module('app.environments.new'));

  var Wizard
    , wizard;

  beforeEach(inject(function(_Wizard_) {
    Wizard = _Wizard_;    
  }));

  describe('#constructor', function() {
    describe('when no mode', function() {
      it('should default to "new"', function() {
        wizard = new Wizard();
        expect(wizard.mode).to.equal('new');
      });
    });

    describe('when "new" mode', function() {     
      beforeEach(function() {
        wizard = new Wizard('new');
      }); 
      it('stage should be "method"', function() {        
        expect(wizard.stage).to.equal('method');
      });
      it('mode should be "new"', function() {        
        expect(wizard.mode).to.equal('new');
      });
    });

    describe('when "edit" mode', function() {
      beforeEach(function() {
        wizard = new Wizard('edit');
      });
      it('stage should be "info"', function() {        
        expect(wizard.stage).to.equal('info');
      });
      it('mode should be "edit"', function() {        
        expect(wizard.mode).to.equal('edit');
      });
    }); 
  });

  describe('#show', function() {
    it('changes the stage to the supplied stage', function() {
      wizard = new Wizard();
      wizard.show('info');
      expect(wizard.stage).to.equal('info');
    });
  });
});