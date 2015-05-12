var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect  
  , fs      = require('fs')
  , Q       = require('q')
  , _       = require('underscore')
  ;

function fixture(name) {
  return JSON.parse(fs.readFileSync(__dirname + '/fixtures/007-create-config/' + name + '.json'), 'utf8');
}

describe('migrations/007-create-configs', function() {

  var sut         = require('../../migrations/007-create-config')
    , migration   = require('../../migrations/migrations')
    , envService  = require('../../src/server/services/env-service')
    ;

  describe('migrate up', function() {
    var stubRunBlock
      , stubFindAllEnvs
      ;

    beforeEach(function() {
      stubRunBlock    = sinon.stub(migration, 'runBlock').yields();
      stubFindAllEnvs = sinon.stub(envService, 'findAll').returns(new Q([]));
    });

    afterEach(function() {
      stubRunBlock.restore();
      stubFindAllEnvs.restore();
    });

    it('should execute 007-createConfigs', function() {
      sut.up();
      expect(stubRunBlock.calledOnce).to.be.true;
    });  

    describe('single machine environment', function() {
      it('should return a single migration', function(next) {
        stubFindAllEnvs.returns(new Q([ fixture('single') ]));
        sut.up(function(err, migrations) {        
          var keys = _.keys(migrations);
          expect(keys.length).to.equal(1);
          expect(keys[0]).to.equal('hjkOY8AItjeMwXNWfJ2Jnw==');      
          next();
        });
      });
      it('should have a single machine in the migration', function(next) {
        stubFindAllEnvs.returns(new Q([ fixture('single') ]));
        sut.up(function(err, migrations) {
          var keys = _.keys(migrations);
          expect(migrations[keys[0]].machines.length).to.equal(1);
          expect(migrations[keys[0]].machines[0].machineId).to.equal(1);
          next();
        });
      });
      it('should create a config with correct config data', function(next) {
        stubFindAllEnvs.returns(new Q([ fixture('single')]));
        sut.up(function(err, migrations) {
          var keys = _.keys(migrations)
            , config = migrations[keys[0]].config
            ;            
          expect(config).to.be.an('object');
          expect(config.data['RoleResolver|ROLE']).to.equal('SKYTAP-ALLINONE');
          expect(config.data['Ringtail8|IS_SQLSERVER_USERNAME']).to.equal('sa');
          expect(config.data['RoleResolver|ROLE']).to.equal('SKYTAP-ALLINONE');
          expect(config.data['Ringtail8|IS_SQLSERVER_USERNAME']).to.equal('sa');
          expect(config.data['RingtailLegalApplicationServer|IS_SQLSERVER_USERNAME']).to.equal('sa');
          expect(config.data['RingtailConfigurator|IS_SQLSERVER_USERNAME']).to.equal('sa');
          expect(config.data['RingtailDatabaseUtility|IS_SQLSERVER_USERNAME']).to.equal('sa');
          expect(config.data['DatabaseUpgrader|IS_SQLSERVER_USERNAME']).to.equal('sa');
          next();
        });
      });
      it('should create a config with the correct role', function() {
        stubFindAllEnvs.returns(new Q([ fixture('single')]));
        sut.up(function(err, migrations) {
          var keys = _.keys(migrations)
            , config = migrations[keys[0]].config
            ;            
          expect(config.roles[0]).to.equal('SKYTAP-ALLINONE');
        });
      });
    });

  });

  describe('migrate down', function() {

  });


});