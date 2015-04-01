var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect
  ;

var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')  
  , expect  = chai.expect
  , path    = require('path')
  ;

describe('SmbBrowser', function() {
  var SmbBrowser = require('../../../../src/server/services/browsers/smb-browser')
    , config = { smbPath: path.resolve(__dirname, '../../fixtures/smb-browser') }
    ;

  describe('#listDirs', function(done) {
    it('should find all directories in the path', function(done) {
      SmbBrowser
        .listDirs(config.smbPath)
        .then(function(dirs) {
          expect(dirs).to.be.instanceOf(Array);
          expect(dirs[0]).to.equal('branch1');
          expect(dirs[1]).to.equal('branch2');
          done();
        })
        .done();
    });
  });

  describe('.branches', function() {          
    it('should return an Array with callback-passing', function(done) {      
      var sut = new SmbBrowser(config);
      sut.branches(function(err, result) {
        expect(result).to.be.instanceOf(Array);
        expect(result.length).to.equal(2);
        expect(result[0]).to.equal('branch1');
        expect(result[1]).to.equal('branch2');
        done();
      });
    });
    it('should return an Array from a promise', function(done) {
      var sut = new SmbBrowser(config);
      sut.branches()
        .then(function(result) {
          expect(result).to.be.instanceOf(Array);
          expect(result.length).to.equal(2);
          expect(result[0]).to.equal('branch1');
          expect(result[1]).to.equal('branch2');
          done();
        })
        .done();
    });
  });

  describe('.builds', function() {  
    it('should return an Array with callback passing', function(done) {      
      var sut = new SmbBrowser(config);
      sut.builds('branch1', function(err, result) {
        expect(result).to.be.instanceOf(Array);
        expect(result.length).to.equal(2);
        expect(result[0]).to.equal('20150401.1');
        expect(result[1]).to.equal('20150401.2');
        done();
      });      
    });
    it('should return an Array from a promise', function(done) {
      var sut = new SmbBrowser(config);
      sut.builds('branch1')
        .then(function(result) {
          expect(result).to.be.instanceOf(Array);
          expect(result.length).to.equal(2);
          expect(result[0]).to.equal('20150401.1');
          expect(result[1]).to.equal('20150401.2');
          done();
        })
        .done();
    });
  });
    
});  