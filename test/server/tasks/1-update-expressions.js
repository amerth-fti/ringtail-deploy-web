var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect

  , Task        = require('../../../src/server/tasks/1-update-expressions')
  , envSvc      = require('../../../src/server/services/env-service')
  ;

describe('Update Expressions Task', function() {

  describe('execute', function() {

    var task
      , scope
      , log;

    beforeEach(function() {
      task = new Task();
    });

    beforeEach(function() {
      task.data = { 
        'env': 'scope.me',
        'update': [
          'scope.me.envName = "new name"',
          'scope.me.envDesc = "new description"',
          'scope.me.machines[0].machineName = "new machine name"'          
        ]
      };
    });

    beforeEach(function() {
      scope = {
        me: {
          envName: 'Name',
          envDesc: 'Description',
          machines: [ { machineName: 'Name' }]
        }
      };
    });
      
    beforeEach(function() {
      log  = sinon.spy();
      sinon.stub(envSvc, 'update', function(env) {
        return env;
      });    
    });

    afterEach(function() {
      sinon.restore(envSvc, 'update');
    });


    it('should perform all updates in \'update\' data', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          expect(scope.me.envName).to.equal('new name');
          expect(scope.me.envDesc).to.equal('new description');
          expect(scope.me.machines[0].machineName).to.equal('new machine name');
        })
        .done(done);
    });    

    it('should call envService.update', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          expect(envSvc.update.withArgs(scope.me).calledOnce).to.be.true;          
        })
        .done(done);
    });

  });

});