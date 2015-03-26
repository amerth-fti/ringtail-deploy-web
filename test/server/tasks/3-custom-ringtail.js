var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect

  , Q               = require('q')
  , RingtailClient  = require('ringtail-deploy-client')

  , Env         = require('../../../src/server/models/env')
  , Machine     = require('../../../src/server/models/machine')
  , Task        = require('../../../src/server/tasks/3-custom-ringtail')
  , machineSvc  = require('../../../src/server/services/machine-service')
  ;

describe('Ringtail Install Task', function() {

  describe('#execute', function() {
    var task
      , log
      , scope
      , env
      , stubWaitForService
      , stubUpdate
      , stubSetConfigs
      , stubInstall
      , stubWaitForInstall
      , stubInstalled
      ;

    env = new Env({ deployedBranch: 'NEW_BRANCH' });
    env.machines = [ 
      new Machine({ role: 'SKYTAP-WEB', intIP: '192.168.0.2' }),
      new Machine({ role: 'SKYTAP-DB', intIP: '192.168.0.3' }),
      new Machine({ role: 'SKYTAP-RPF', intIP: '192.168.0.4' })
    ];

    task   = new Task();
    task.pollInterval = 0;
    task.installInterval = 0;
    task.data = {
      'branch': 'scope.env.deployedBranch',
      'machine': 'scope.env.machines[0]',
      'config': {
        'CONFIG1': 'VALUE_OF_CONFIG1',
        'CONFIG2': 'VALUE_OF_CONFIG2'
      }
    };
    scope  = {
      'env': env
    };

    function returnInstalled() {
      /* jshint es5:false */
      /* jshint ignore:start */
      return Q([ 'one', 'two' ]);
      /* jshint ignore:end */
    }

    beforeEach(function() {      
      log = sinon.spy();
          
      stubWaitForService  = sinon.stub(RingtailClient.prototype, 'waitForService');
      stubUpdate          = sinon.stub(RingtailClient.prototype, 'update');
      stubSetConfigs      = sinon.stub(RingtailClient.prototype, 'setConfigs');
      stubInstall         = sinon.stub(RingtailClient.prototype, 'install');
      stubWaitForInstall  = sinon.stub(RingtailClient.prototype, 'waitForInstall');
      stubInstalled       = sinon.stub(RingtailClient.prototype, 'installed', returnInstalled);

      sinon.stub(machineSvc, 'update');
    });

    afterEach(function() {        
      stubWaitForService.restore();
      stubUpdate.restore();
      stubSetConfigs.restore();
      stubInstall.restore();
      stubWaitForInstall.restore();
      stubInstalled.restore();
      machineSvc.update.restore();
    });

    it('service client uses correct machine host', function(done) {
      task
        .execute(scope, log)
        .then(function() {          
          expect(task.serviceClient.serviceHost).to.equal(env.machines[0].intIP);
        })
        .done(done);
    }); 

    it('waits for the installer service', function(done) {
      task
        .execute(scope, log)
        .then(function() {          
          expect(stubWaitForService.callCount).to.equal(2);
        })
        .done(done);
    });  

    it('triggers an update of the install service', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          expect(stubInstall.called).to.be.true;
          expect(stubWaitForInstall.calledOnce).to.be.true;
        })
        .done(done);
    });

    it('configures the service configs', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          expect(stubSetConfigs.calledOnce).to.be.true;
        })
        .done(done);
    });

    it('starts the installation', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          expect(stubInstall.calledOnce).to.be.true;
        })
        .done(done);
    });

    it('waits for installation to complete', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          expect(stubWaitForInstall.calledOnce).to.be.true;
        })
        .done(done);
    });

    it('updates the machine installNotes', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          expect(stubInstalled.calledOnce).to.be.true;
        })
        .done(done);
    });

    it('sets the install notes for the machine', function(done) {
      task
        .execute(scope, log)
        .then(function() {                
          expect(env.machines[0].installNotes.length).to.equal(2);
          expect(env.machines[0].installNotes[0]).to.equal('one');
          expect(env.machines[0].installNotes[1]).to.equal('two');      
        })
        .done(done);
    });

    it('saves the machine info', function(done) {
      task
        .execute(scope, log)
        .then(function() {                
          expect(machineSvc.update.calledOnce).to.be.true;
        })
        .done(done);
    });

  });

});