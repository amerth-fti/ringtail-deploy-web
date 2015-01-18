var mocha   = require('mocha')
  , chai    = require('chai')
  , expect  = chai.expect

  , Task    = require('../../../src/server/tasks/task')
  ;

describe('Task', function() {

  describe('validate', function() {

    var task;

    beforeEach(function() {
      task = new Task();
      task.validators.required.push('test');
    });

    it('should return null when valid', function() {
      task.data = { 'test': 'test' };
      var result = task.validate();
      expect(result).to.be.null;
    });

    it('should return validation error objects', function() {
      var result = task.validate();
      expect(result).to.be.an('array');
      expect(result.length).to.equal(1);
    });

  });

});