var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect
  , Q       = require('q')
  , Env     = require('../../../src/server/models/env')
  , Region  = require('../../../src/server/models/region')
  , Task    = require('../../../src/server/tasks/3-install-many')
  , EnvSvc  = require('../../../src/server/services/env-service')    
  , RegSvc  = require('../../../src/server/services/region-service')  
  ;

describe('3-install-many', function() {

  describe('#execute', function() {
    var task
      , log
      , scope
      , env
      ;

    beforeEach(function() {
      log = sinon.spy();
      env = new Env({
        machines: [
          { machineId: 1, configId: 101, machineName: 'Machine 1' },
          { machineId: 2, configId: 102, machineName: 'Machine 2' },
          { machineId: 3, configId: null, machineName: 'Machine 3' }
        ]
      });
      region = new Region({
        regionId: 1001
      });      

      EnvSvc.findRegionByEnvId = function(x) {
        return region.regionId;
      }
      RegSvc.findById = function(x) {
        return region;
      }
      scope = {
        'me': env
      };
    });

    describe('when unknown options', function() {
      beforeEach(function() {
        task = new Task({ });
      });

      it('should throw an exception', function(done) {
        task
          .execute(scope, log)
          .then(function() {
            throw new Error('I failed to throw an exception');
          })
          .catch(function(err) {
            expect(err.message).to.equal('Install type of undefined is not supported');
          })
          .then(done)
          .catch(done);
      });
    });

    describe('when installing all', function() {
      beforeEach(function() {
        // create new task with install options
        task = new Task({
          installs: 'all',
          name: 'Install Ringtail'
        });
        // stub parent execute so it doesn't execute Parallel execute method
        task.parentExecute = sinon.stub();
      });
      it('creates an install task for machines with configs', function(done) {
        task
          .execute(scope, log)
          .then(function() {
            expect(task.taskdefs.length).to.equal(2);
            expect(task.taskdefs[0].task).to.equal('3-install-machine');
            expect(task.taskdefs[1].task).to.equal('3-install-machine');
          })
          .then(done)
          .catch(done);
      });
      it('includes the machineName in the taskdef', function(done) {
        task
          .execute(scope, log)
          .then(function() {
            expect(task.taskdefs[0].options.name).to.equal(env.machines[0].machineName);
            expect(task.taskdefs[1].options.name).to.equal(env.machines[1].machineName);
          })
          .then(done)
          .catch(done);
      });
      it('includes the machineIds in the taskdefs', function(done) {
        task
          .execute(scope, log)
          .then(function() {
            expect(task.taskdefs[0].options.machineId).to.equal(env.machines[0].machineId);
            expect(task.taskdefs[1].options.machineId).to.equal(env.machines[1].machineId);
          })
          .then(done)
          .catch(done);
      });
      it('includes the regionId in the taskdefs', function(done) {
        task
          .execute(scope, log)
          .then(function() {
            expect(task.taskdefs[0].options.region.regionId).to.equal(region.regionId);
            expect(task.taskdefs[1].options.region.regionId).to.equal(region.regionId);
          })
          .then(done)
          .catch(done);
      });      
      it('includes the configId in the taskdefs', function(done) {
        task
          .execute(scope, log)
          .then(function() {
            expect(task.taskdefs[0].options.configId).to.equal(env.machines[0].configId);
            expect(task.taskdefs[1].options.configId).to.equal(env.machines[1].configId);
          })
          .then(done)
          .catch(done);
      });
      it('includes the task data reference for the branch', function(done) {
        task
          .execute(scope, log)
          .then(function() {
            expect(task.taskdefs[0].options.data.branch).to.equal('scope.me.deployedBranch');
            expect(task.taskdefs[1].options.data.branch).to.equal('scope.me.deployedBranch');
          })
          .then(done)
          .catch(done);
      });
    });

  });
});