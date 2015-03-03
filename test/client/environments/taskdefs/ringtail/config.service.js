describe('Ringtail Config Service', function() {
  beforeEach(module('underscore'));
  beforeEach(module('app.environments.taskdefs.ringtail'));
  var sut;    


  beforeEach(inject(function($injector) {
    sut = $injector.get( 'RingtailConfig' );
  }));

  beforeEach(function() {
    var rolesData = [
      {
        'roles': ['DATABASE'],
        'configs': [
          'DBCONFIG'
        ],
      },
      {
        'roles': ['WEB'], 
        'configs': [
          'WEBCONFIG'
        ]
      },
      {
        'roles': ['AGENT', 'WEB'],
        'configs': [
          'OTHERCONFIG'
        ]
      }
    ];
    sut.updateRolesData(rolesData);
  });


  describe('.configsForRole', function() {
    it('should return non-aggregated configs', function() {
      var role = 'DATABASE'
        , result;
      result = sut.configsForRole(role);
      expect(result.length).to.equal(1);
      expect(result[0]).to.equal('DBCONFIG');
    });

    it('should return aggregated configs', function() {
      var role = 'WEB'
        , result;
      result = sut.configsForRole(role);
      expect(result.length).to.equal(2);
      expect(result[0]).to.equal('WEBCONFIG');
      expect(result[1]).to.equal('OTHERCONFIG');
    });

    it('should return empty array for unknown role', function() {
      var role = 'BLAH'
        , result;
      result = sut.configsForRole(role);
      expect(result.length).to.equal(0);
    });
  });


});