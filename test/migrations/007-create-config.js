var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect  
  , fs      = require('fs')
  ;

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
      stubRunBlock    = sinon.stub(migration, 'runBlock');
      stubFindAllEnvs = sinon.stub(envService, 'findAll');
    });

    afterEach(function() {
      stubRunBlock.restore();
      stubFindAllEnvs.restore();
    });

    it('should execute 007-createConfigs', function() {
      sut.up();
      expect(stubRunBlock.calledOnce).to.be.true;
    });  

    describe('for single machine environment', function() {

    });

      // describe('when 3-ringtail-install is inside parallel', function() {
      //   it('should find the installation for each machine', function() {

      //   });
      // });    

      // describe('All-in-one configuration', function() {
      //   it('should create a single config', function() {

      //   });
      // });       

      // describe('Multi-server configuration', function() {
      //   it('should create a config for each role', function() {

      //   });
      // });

  });

  describe('migrate down', function() {

  });


});