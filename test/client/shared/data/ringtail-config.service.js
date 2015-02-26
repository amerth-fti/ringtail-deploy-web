describe('Ringtail Config Service', function() {
  beforeEach(module('shared.data'));
  var sut
    , $httpBackend;


  beforeEach(inject(function($injector) {
    sut = $injector.get( 'RingtailConfig' );
    $httpBackend = $injector.get('$httpBackend');
  }));


  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });



  describe('.get', function() {
    it('should call the config endpoint', function() {
      $httpBackend
        .expectGET('/api/ringtail/configs?role=MYROLE')
        .respond(200, { });
      sut.get('MYROLE');
      $httpBackend.flush();
    });
  });


  describe('.details', function() {
    it('should return the description for a existing key', function() {
      var config = 'Common|IS_SQLSERVER_SERVER'
        , result
        ;
      result = sut.details(config);
      expect(result).to.be.a('string');
      expect(result.length).to.be.above(0);
    });    
  });


  describe('.split', function() {
    it('should return the application part', function() {
      var test = 'Common|IS_SQLSERVER_SERVER'
        , result
        ;
      result = sut.split(test);
      expect(result.application).to.equal('Common');
    });

    it('should return the key part', function() {
      var test = 'Common|IS_SQLSERVER_SERVER'
        , result
        ;
      result = sut.split(test);
      expect(result.key).to.equal('IS_SQLSERVER_SERVER');
    });
  });


  describe('.combine', function() {
    it('should combine the application part and key part', function() {
      var test = { application: 'Common', key: 'IS_SQLSERVER_SERVER' }
        , result
        ;
      result = sut.combine(test);
      expect(result).to.equal('Common|IS_SQLSERVER_SERVER');
    });
  });


  describe('.dedeup', function() {
    var configs = [
      'Ringail8|IS_SQLSERVER_SERVER',      
      'Ringail8|IS_SQLSERVER_USERNAME',
      'Ringail8|IS_SQLSERVER_PASSWORD',
      'Ringail8|IS_SQLSERVER_DATABASE',
      'RingtailApplicationServer|IS_SQLSERVER_SERVER',      
      'RingtailApplicationServer|IS_SQLSERVER_USERNAME',
      'RingtailApplicationServer|IS_SQLSERVER_PASSWORD',
      'RingtailApplicationServer|IS_SQLSERVER_DATABASE',
      'RingtailApplicationServer|RMCIISWEBAPPLICATIONURL',
      'RingtailProcessingFramework|IS_SQLSERVER_SERVER',      
      'RingtailProcessingFramework|IS_SQLSERVER_USERNAME',
      'RingtailProcessingFramework|IS_SQLSERVER_PASSWORD',
      'RingtailProcessingFramework|IS_SQLSERVER_DATABASE',
      'RingtailProcessingFramework|RPFWORKERPATH'
    ];
    it('should coallese common configs', function() {
      var configs = [
        'Ringtail8|IS_SQLSERVER_SERVER',      
        'RingtailApplicationServer|IS_SQLSERVER_SERVER'
      ];
      var results = sut.dedup(configs);
      expect(results.length).to.equal(1);
      expect(results[0]).to.equal('Common|IS_SQLSERVER_SERVER');      
    });

    it('should retain unique configs', function() {
      var configs = [
        'Ringtail8|IS_SQLSERVER_SERVER',      
        'RingtailApplicationServer|IS_SQLSERVER_USERNAME'
      ];
      var results = sut.dedup(configs);
      expect(results.length).equal(2);
      expect(results[0]).to.equal('Ringtail8|IS_SQLSERVER_SERVER');
      expect(results[1]).to.equal('RingtailApplicationServer|IS_SQLSERVER_USERNAME');
    });
  });  
});