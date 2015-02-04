var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect

  , Task        = require('../../../src/server/tasks/1-update-environment')
  , envSvc      = require('../../../src/server/services/env-service')
  , machineSvc  = require('../../../src/server/services/machine-service')
  ;

describe('Update Env Record Task', function() {

  describe('execute', function() {

    var task
      , scope
      , log;

    beforeEach(function() {
      task = new Task();
      task.data = { 
        'skytapEnv': 'scope.skytapEnv',
        'env': 'scope.env' 
      };

      scope = {
        skytapEnv: { 
          id: 1,
          vms: []
        },
        env: {
          machines: []
        }
      };

      log  = sinon.spy();
      sinon.stub(envSvc, 'update', function(env) {
        return env;
      });
      sinon.stub(machineSvc, 'update', function(machine) {
        return machine;
      });
    });

    afterEach(function() {
      sinon.restore(envSvc, 'update');
      sinon.restore(machineSvc, 'update');
    });

    it('should update env record', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          expect(envSvc.update.calledOnce).to.be.true;
          expect(scope.env.remoteId).to.equal(1);
        })
        .done(done);
    });

    it('should update all machine records', function(done) {
      scope.env.machines.push({ installNotes: 'value' });
      scope.env.machines.push({ installNotes: 'value' });
      scope.skytapEnv.vms.push({ id: 1, interfaces: [ { nat_addresses: { vpn_nat_addresses: [ { ip_address: '192.168.0.2' } ] } }] });
      scope.skytapEnv.vms.push({ id: 2, interfaces: [ { nat_addresses: { vpn_nat_addresses: [ { ip_address: '192.168.0.3' } ] } }] });

      task
        .execute(scope, log)
        .then(function(env) {
          expect(env.machines[0].remoteId).to.equal(1);
          expect(env.machines[0].intIP).to.equal('192.168.0.2');
          expect(env.machines[0].installNotes).to.equal(null);
          expect(env.machines[1].remoteId).to.equal(2);
          expect(env.machines[1].intIP).to.equal('192.168.0.3');
          expect(env.machines[1].installNotes).to.equal(null);
        })
        .done(done);

    });

    it('should throw an error if env machines mismatchs skytap machines', function(done) {
      scope.env.machines.push({});
      task
        .execute(scope, log)
        .then(
          function() {
            throw new Error('expected exception');
          }, 
          function(err) {
            expect(err).to.not.be.null;
          })
        .done(done);
    });

  });

});