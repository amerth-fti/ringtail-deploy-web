describe('Roles Service', function() {
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


});