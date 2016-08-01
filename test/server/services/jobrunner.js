var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect
  ;

describe('Job Runner', function() {
  var runner           = require('../../../src/server/jobrunner');

  describe('.arrayifyDetails ', function() {
    describe('when no results yet', function() {
      it('should create an empty array', function() {
        var result = runner.convertdetailstoarray("");
        expect(result).to.be.instanceOf(Array);
        expect(result.length).to.equal(0);
      });
    });

    describe('when some results', function() {
      it('should create a non-empty array', function() {
        var content = "<html><p>start1</p><p>finish1</p><p>-----------</p><p>start2</p></html>";
        var result = runner.convertdetailstoarray(content);
        console.log(result);
        expect(result).to.be.instanceOf(Array);
        expect(result.length).to.equal(2);
      });
    });
  });
});