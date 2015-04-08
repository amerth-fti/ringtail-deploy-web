var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect
  ;

describe('StaticBrowser', function() {
  var StaticBrowser = require('../../../../src/server/services/browsers/static-browser')
    , config
    ;

  beforeEach(function() {
    config = { staticBranches: 'MAIN\nCONSOLIDATION' };
  });


  describe('.branches', function() {      
    it('should return an Array from the config with callback-passing', function(done) {      
      var sut = new StaticBrowser(config);
      sut.branches(function(err, result) {
        expect(result).to.be.instanceOf(Array);
        expect(result.length).to.equal(2);
        done();
      });
    });
    it('should return an Array from the config from a promise', function(done) {      
      var sut = new StaticBrowser(config);
      sut.branches()
        .then(function(result) {
          expect(result).to.be.instanceOf(Array);
          expect(result.length).to.equal(2);
          done();
        })
        .done();
    });
  });

  describe('.builds', function() {  
    it('should return an empty Array with callback passing', function(done) {      
      var sut = new StaticBrowser(config);
      sut.builds(null, function(err, result) {
        expect(result).to.be.instanceOf(Array);
        expect(result.length).to.equal(0);
        done();
      });      
    });
    it('should return an empty Array from a promise', function(done) {
      var config = { };
      var sut = new StaticBrowser(config);
      sut.builds(null)
        .then(function(result) {
          expect(result).to.be.instanceOf(Array);
          expect(result.length).to.equal(0);
          done();
        })
        .done();
    });

  });
    
});
