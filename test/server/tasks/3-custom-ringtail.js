var mocha   = require('mocha')
  , sinon   = require('sinon')
  , chai    = require('chai')
  , expect  = chai.expect

  , request = require('request')

  , Env         = require('../../../src/server/models/env')
  , Machine     = require('../../../src/server/models/machine')
  , Task        = require('../../../src/server/tasks/3-custom-ringtail')
  , machineSvc  = require('../../../src/server/services/machine-service')
  ;

describe('Ringtail Install Task', function() {

  describe('execute', function() {
    var task
      , log
      , scope
      , env
      , requestGet     
      ;

    beforeEach(function() {
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

      log = sinon.spy();
          
      requestGet = sinon.stub(request, 'get')
        // stub status failure
        .onCall(0)
        .callsArgWith(1, 'Timeout', null, null)

        // stub status success
        .onCall(1)
        .callsArgWith(1, null, { statusCode: 200 }, 'body')

        // stub update service
        .onCall(2)
        .callsArgWith(1, null, { statusCode: 200 }, 'body')

        // stub status failure
        .onCall(3)
        .callsArgWith(1, 'Timeout', null, null)

        // stub status success
        .onCall(4)
        .callsArgWith(1, null, { statusCode: 200 }, 'body')

        // stub configure branch
        .onCall(5)
        .callsArgWith(1, null, { statusCode: 200 }, 'body')

        // stub configure CONFIG1
        .onCall(6)
        .callsArgWith(1, null)

        // stub configure CONFIG2
        .onCall(7)
        .callsArgWith(1, null)

        // stub install call
        .onCall(8)

        // stub install status failure
        .onCall(9)
        .callsArgWith(1, 'Timeout')

        // stub install status incomplete
        .onCall(10)
        .callsArgWith(1, null, { statusCode: 200 }, 'incomplete')

        // stub install status complete
        .onCall(11)
        .callsArgWith(1, null, { statusCode: 200}, 'UPGRADE COMPLETE')

        // stub installation info
        .onCall(12)
        .callsArgWith(1, null, { statusCode: 200}, 'Install Notes\n')

        ;

        sinon.stub(machineSvc, 'update');
    });

    afterEach(function() {  
      request.get.restore();
      machineSvc.update.restore();
    });

    it('waits for the installer service', function(done) {
      task
        .execute(scope, log)
        .then(function() {          
          var call1 = requestGet.stub.getCall(0)
            , call2 = requestGet.stub.getCall(1)
            ;
          expect(call1.args[0].url).to.equal('http://192.168.0.2:8080/api/status');                    
          expect(call2.args[0].url).to.equal('http://192.168.0.2:8080/api/status');
        })
        .done(done);
    });  

    it('triggers an update of the install service', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          var call1 = requestGet.stub.getCall(2);
          var call2 = requestGet.stub.getCall(3);
          var call3 = requestGet.stub.getCall(4);
          expect(call1.args[0]).to.equal('http://192.168.0.2:8080/api/UpdateInstallerService');
          expect(call2.args[0].url).to.equal('http://192.168.0.2:8080/api/status');
          expect(call3.args[0].url).to.equal('http://192.168.0.2:8080/api/status');
        })
        .done(done);
    });

    it('configures the branch', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          var call1 = requestGet.stub.getCall(5);          
          expect(call1.args[0]).to.equal('http://192.168.0.2:8080/api/config?key=Common|BRANCH_NAME&value=NEW_BRANCH');          
        })
        .done(done);
    });

    it('configures additional configs', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          var call1 = requestGet.stub.getCall(6)
            , call2 = requestGet.stub.getCall(7)
            ;
          expect(call1.args[0]).to.equal('http://192.168.0.2:8080/api/config?key=CONFIG1&value=VALUE_OF_CONFIG1');
          expect(call2.args[0]).to.equal('http://192.168.0.2:8080/api/config?key=CONFIG2&value=VALUE_OF_CONFIG2');
        })
        .done(done);
    });

    it('starts the installation', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          var call1 = requestGet.stub.getCall(8)
            ;
          expect(call1.args[0]).to.equal('http://192.168.0.2:8080/api/installer');
        })
        .done(done);
    });

    it('waits for installation to complete', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          var call1 = requestGet.stub.getCall(9)
            , call2 = requestGet.stub.getCall(10)
            , call3 = requestGet.stub.getCall(11)
            ;
          expect(call1.args[0]).to.equal('http://192.168.0.2:8080/api/status');
          expect(call2.args[0]).to.equal('http://192.168.0.2:8080/api/status');
          expect(call3.args[0]).to.equal('http://192.168.0.2:8080/api/status');
        })
        .done(done);
    });

    it('updates the machine installNotes', function(done) {
      task
        .execute(scope, log)
        .then(function() {
          var call1 = requestGet.stub.getCall(12)
            ;
          expect(call1.args[0].url).to.equal('http://192.168.0.2:8080/api/installedBuilds');
          expect(scope.env.machines[0].installNotes).to.be.an('array');
          expect(scope.env.machines[0].installNotes[0]).to.equal('Install Notes');
        })
        .done(done);
    });

  });

});