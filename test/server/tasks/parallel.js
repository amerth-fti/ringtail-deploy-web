var Q       = require('q')
  , mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect
  , assert  = chai.assert

  , Parallel    = require('../../../src/server/tasks/parallel')
  , Task        = require('../../../src/server/tasks/task')
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
      sinon.spy(subs[0], 'start');
      sinon.spy(subs[1], 'start');

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

    describe('when there is an error', function() {
      beforeEach(function() {
        subs = [
          new Task(),
          new Task(),
          new Task(),
          new Task()
        ];
        taskfactory.createTasks = sinon
          .stub()
          .returns(subs);

        subs[0].execute = function() {
          return Q.Promise(function(resolve, reject) {
            setTimeout(reject, 10);
          });
        };
        subs[1].execute = function() {
          return Q.Promise(function(resolve, reject) {
            setTimeout(reject, 10);
          });
        };
        subs[2].execute = function() {
          return Q.Promise(function(resolve) {
            setTimeout(resolve, 10);
          });
        };
        subs[3].execute = function() {
          return Q.Promise(function(resolve) {
            setTimeout(resolve, 10);
          });
        };
      });

      it('should allow other tasks to complete', function(done) {
        task
          .execute(scope, log)
          .then(
            assert.fail,
            function(err) {
              expect(subs[0].status).to.equal('Failed');
              expect(subs[1].status).to.equal('Failed');
              expect(subs[2].status).to.equal('Succeeded');
              expect(subs[3].status).to.equal('Succeeded');
              done();
            })
          .done();
      });

      it('should fail after all tasks are complete', function(done) {
        task
          .execute(scope, log)
          .then(
            assert.fail,
            function(err) {
              expect(err.message).to.equal('There were errors in the subtasks');
              done();
            })
          .done();
      });
    });
  });

});