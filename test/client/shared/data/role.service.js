describe('Roles Service', function() {
  beforeEach(module('shared.data'));
  var sut;

  beforeEach(inject(function($injector) {
    sut = $injector.get( 'Role' );
    sut.roles([
      'SKYTAP-WEB',
      'SKYTAP-DB',
      'WEB',
      'DB'
    ]);
  }));


  describe('.distinct', function() {
    it('should find distinct roles', function() {
      var data = [ 'WEB', 'WEB', 'WEB', 'DB', 'DB' ]
        , result = sut.distinct(data);
      expect(result.length).to.equal(2);
      expect(result[0]).to.equal('WEB');
      expect(result[1]).to.equal('DB');
    });

    it('should ignore null roles', function() {
      var data = [ null, 'WEB' ]
        , result = sut.distinct(data);
      expect(result.length).to.equal(1);
      expect(result[0]).to.equal('WEB');
    });
  });


  describe('.environment', function() {
    it('should find distinct roles for the environment', function() {
      var env
        , result
        ;
      env = {
        machines: [
          { role: 'WEB' },
          { role: 'DB' },
          { role: null }
        ]
      };
      result = sut.environment(env);
      expect(result.length).to.equal(2);
      expect(result[0]).to.equal('WEB');
      expect(result[1]).to.equal('DB');
    });
  });


  describe('.roles', function() {
    it('should get the roles', function() {
      var result = sut.roles();
      expect(result.length).to.be.equal(4);
    });

    it('should set the roles', function() {
      var result = sut.roles([]);
      expect(result.length).to.equal(0);
    });
  });

});