var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect
  , nock    = require('nock')
  ;

describe('HttpBrowser', function() {
  var HttpBrowser = require('../../../../src/server/services/browsers/http-browser');

  describe('.branches', function() {      
    var sut
      , mockRequest
      ;
    beforeEach(function() {      
      sut = new HttpBrowser({ httpBranchesUri: 'http://localhost:8080/Api/V1/Directory' });
      mockRequest = nock('http://localhost:8080')
        .get('/Api/V1/Directory')
        .reply(200, [ '2015', 'CONSOLIDATION' ]);
    });
    it('should make a call to the httpHost', function(done) {      
      sut.branches(function(err, result) {
        mockRequest.done();
        done();
      });
    });
    it('should return an Array with callback-passing', function(done) {      
      sut.branches(function(err, result) {        
        expect(result).to.be.instanceOf(Array);
        expect(result.length).to.equal(2);        
        done();
      });
    });
    it('should return an empty Array from a promise', function(done) {      
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
    var sut
      , mockRequest
      , branch = 'CONSOLIDATION'
      ;
    beforeEach(function() {
      sut = new HttpBrowser({ httpBuildsUri: 'http://localhost:8080/Api/V1/Directory?path=:branch' });
      mockRequest = nock('http://localhost:8080')
        .get('/Api/V1/Directory?path=CONSOLIDATION')
        .reply(200, [ 'consolidation/20140401.1', 'consolidation/20140401.2', 'consolidation/20140401.3' ]);
    });
    it('should make a call to the httpHost', function(done) {
      sut.builds(branch, function(err, result) {
        mockRequest.done();
        done();
      });
    });
    it('should strip out branch name from build paths', function(done) {
      sut.builds(branch, function(err, result) {
        expect(result[0]).to.equal('20140401.1');
        expect(result[1]).to.equal('20140401.2');
        expect(result[2]).to.equal('20140401.3');        
        done();
      });      
    });
    it('should return an Array with callback passing', function(done) {      
      sut.builds(branch, function(err, result) {
        expect(result).to.be.instanceOf(Array);
        expect(result.length).to.equal(3);
        done();
      });      
    });
    it('should return an Array from a promise', function(done) {      
      sut.builds(branch)
        .then(function(result) {
          expect(result).to.be.instanceOf(Array);
          expect(result.length).to.equal(3);
          done();
        })
        .done();
    });    
  });
    
});
