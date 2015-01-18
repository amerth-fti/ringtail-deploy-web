var Q       = require('q')
  , mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect
  , assert  = chai.assert

  , Parallel    = require('../../../src/server/tasks/Parallel')
  , Task        = require('../../../src/server/tasks/Task')
  , taskfactory = require('../../../src/server/taskfactory')
  ;

describe('Parallel Task', function() {
  var task
    , scope
    , log
    ;

  describe('#execute', function() {
    var subs;

    beforeEach(function() {
      task = new Parallel();
      subs = [
        new Task(),
        new Task()
      ];
      sinon.stub(subs[0], 'start');
      sinon.stub(subs[1], 'start');
      
      scope = {};
      log = sinon.spy();
      taskfactory.createTasks = sinon
        .stub()
        .returns(subs);
    });

    it('converts taskdefs to tasks', function() {
      task.execute(scope, log);
      expect(task.tasks).to.be.an('array');
      expect(task.tasks.length).to.equal(2);
    });

    it('starts each task', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          expect(subs[0].start.calledOnce).to.be.true;
          expect(subs[1].start.calledOnce).to.be.true;
        })
        .done(done);
    });

    it('emits a \'log\' for each subtask \'log\' event', function(done) {
      sinon.restore(subs[0], 'start');
      sinon.stub(subs[0], 'start', function() {
        subs[0].log('hello');
      });

      task.on('log', function(log) { 
        expect(log).to.equal('hello');
        done(); 
      });
      task.execute(scope, log);
    });
  });

});