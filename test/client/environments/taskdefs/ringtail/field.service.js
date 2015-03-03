(function() {

  describe('Ringtail Field Service', function() {

    beforeEach(module('underscore'));
    beforeEach(module('app.environments.taskdefs.ringtail'));
    var sut;


    beforeEach(inject(function($injector) {
      sut = $injector.get( 'RingtailField' );    
    }));


    describe('.getFieldForConfigKey', function() {
      it('should retrieve a field record', function() {
        var config = 'RingtailLegalApplicationServer|IS_SQLSERVER_SERVER'
          , result;
        result = sut.getFieldForConfigKey(config);
        expect(result.key).to.equal('IS_SQLSERVER_SERVER_PORTAL');
      });

      it('should return the UNKNOWN field when unknown', function() {
        var config = 'FOO|BAR'
          , result;
        result = sut.getFieldForConfigKey(config);
        expect(result.key).to.equal('UNKNOWN');
      });      
    });

  });

}());