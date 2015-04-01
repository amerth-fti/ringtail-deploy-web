var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect
  ;

describe('EmptyBrowser', function() {
  var EmptyBrowser = require('../../../../src/server/services/browsers/empty-browser');

  describe('.branches', function() {      
    it('should return an empty Array with callback-passing', function(done) {
      var config = { };
      var sut = new EmptyBrowser(config);
      sut.branches(function(err, result) {
        expect(result).to.be.instanceOf(Array);
        expect(result.length).to.equal(0);
        done();
      });
    });
    it('should return an empty Array from a promise', function(done) {
      var config = { };
      var sut = new EmptyBrowser(config);
      sut.branches()
        .then(function(result) {
          expect(result).to.be.instanceOf(Array);
          expect(result.length).to.equal(0);
          done();
        })
        .done();
    });
  });

  describe('.builds', function() {  
    it('should return an empty Array with callback passing', function(done) {
      var config = { };
      var sut = new EmptyBrowser(config);
      sut.builds(null, function(err, result) {
        expect(result).to.be.instanceOf(Array);
        expect(result.length).to.equal(0);
        done();
      });      
    });
    it('should return an empty Array from a promise', function(done) {
      var config = { };
      var sut = new EmptyBrowser(config);
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
