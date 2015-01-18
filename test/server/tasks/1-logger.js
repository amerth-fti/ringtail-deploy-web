var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect

  , Task    = require('../../../src/server/tasks/1-logger')
  ;

describe('Logger Task', function() {

  describe('execute', function() {

    it('should log the supplied message', function() {
      var task   = new Task()
        , log    = sinon.spy()
        , scope  = { message: 'hello' }
        ;

      task.execute(scope, log);
      expect(log.calledOnce).to.be.true;
    });

  });

});