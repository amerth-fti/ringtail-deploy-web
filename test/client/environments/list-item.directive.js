
describe('listItem Directive', function() {
  beforeEach(module('templates'));
  beforeEach(module('app'));
  beforeEach(module('app.environments', function($provide) {

    $provide.constant('config', function() {
      return {
        enableDeployment: true
      };
    });

  }));

  var element
    , environment
    , controller
    , $q
    , $rootScope
    ;

  beforeEach(function() {
    environment = { 
      $get: function() {},
      $reset: function() {},
      $update: function() {},
      $redeploy: function() {},
      $pause: function() {},
      $start: function() {}
    };
  });

  beforeEach(inject(function(_$rootScope_, $compile, _$q_) {    
    $rootScope = _$rootScope_;
    $q = _$q_;

    // create the element
    element = angular.element('<list-item environment="vm.environment"></list-item>');

    // create the element scope
    $rootScope.vm = {
      environment: environment
    };
    $compile(element)($rootScope);

    
  }));

  function run() {
    $rootScope.$digest();
    controller = element.controller('listItem');
  }   

  describe('#activate', function() {
    it('sets the environment', function() {
      run();
      expect(controller.environment).to.equal(environment);
    });

    describe('with a local environment', function() {
      it('sets runStatus to "running"', function() {
        environment.remoteType = null;
        run();
        expect(controller.runStatus).to.equal('running');
      });          
    });

    describe('with skytap environment', function() {
      beforeEach(function() {
        environment.remoteType = 'skytap';
      });
      it('sets runStatus to "unknown" when no runstate', function() {
        environment.runstate = null;
        run();
        expect(controller.runStatus).to.equal('unknown');
      });    
      it('sets runStatus to the environment runstate', function() {
        environment.runstate = 'running';
        run();
        expect(controller.runStatus).to.equal('running');
      });    
    });
  

    it('polls when environment state is busy');

    it('polls when environment is deploying');

  });

  describe('.showStartStop', function() {
    describe('for skytap environments', function() {
      beforeEach(function() {
        environment.remoteType = 'skytap';
        environment.runstate = 'running';
      });
      it('returns true when status is "deployed"', function() {
        environment.status = 'deployed';
        run();
        expect(controller.showStartStop()).to.be.true;
      });
      it('returns false when status is "deploying"', function() {
        environment.status = 'deploying';
        run();
        expect(controller.showStartStop()).to.be.false;
      });
      it('returns true when status is "failed"', function() {
        environment.status = 'failed';
        run();
        expect(controller.showStartStop()).to.be.true;
      });
      it('returns false when runstate is null', function() {
        environment.status = 'deployed';
        environment.runstate = null;
        run();
        expect(controller.enableStart()).to.be.false;
      });
    });    
    describe('for local environments', function() {
      it('returns false', function() {
        environment.remoteType = null;
        run();
        expect(controller.showStartStop()).to.be.false;
      });  
    });      
  });

  describe('.enableStart', function() {
    describe('for skytap environments', function() {
      beforeEach(function() {
        environment.remoteType = 'skytap';
      });
      it('returns true when runstate is "suspended"', function() {
        environment.runstate = 'suspended';
        run();
        expect(controller.enableStart()).to.be.true;
      });
      it('returns true when runstate is "stopped"', function() {
        environment.runstate = 'stopped';
        run();
        expect(controller.enableStart()).to.be.true;
      });
      it('returns false when runstate is "running"', function() {
        environment.runstate = 'running';
        run();
        expect(controller.enableStart()).to.be.false;
      });      
    });    
    describe('for local environments', function() {
      it('returns false', function() {
        environment.remoteType = null;
        run();
        expect(controller.enableStart()).to.be.false;
      });  
    });
  });

  describe('.showRedeploy', function() {    
    it('returns true when status is "deployed"', function() {
      environment.status = 'deployed';
      run();
      expect(controller.showRedeploy()).to.be.true;
    });
    it('returns true when status is "failed"', function() {
      environment.status = 'failed';
      run();
      expect(controller.showRedeploy()).to.be.true;
    });
    it('returns false when status is "deploying"', function() {
      environment.status = 'deploying';
      run();
      expect(controller.showRedeploy()).to.be.false;
    });    
  });

  describe('.showCancel', function() {    
    it('returns false when status is "deployed"', function() {
      environment.status = 'deployed';
      run();
      expect(controller.showCancel()).to.be.false;
    });
    it('returns false when status is "failed"', function() {
      environment.status = 'failed';
      run();
      expect(controller.showCancel()).to.be.false;
    });
    it('returns true when status is "deploying"', function() {
      environment.status = 'deploying';
      run();
      expect(controller.showCancel()).to.be.true;
    });    
  });

  describe('.showDeployLink', function() {    
    it('returns false when status is "deployed"', function() {
      environment.status = 'deployed';
      run();
      expect(controller.showDeployLink()).to.be.false;
    });
    it('returns true when status is "failed"', function() {
      environment.status = 'failed';
      run();
      expect(controller.showDeployLink()).to.be.true;
    });
    it('returns true when status is "deploying"', function() {
      environment.status = 'deploying';
      run();
      expect(controller.showDeployLink()).to.be.true;
    });    
  });



  describe('.start()', function() {
    var EnvironmentStarter
      , $q;

    beforeEach(inject(function(_EnvironmentStarter_, _$q_) {
      EnvironmentStarter = _EnvironmentStarter_;
      $q = _$q_;
    }));

    it('should open the starter dialog', function() {
      var stub = sinon
        .stub(EnvironmentStarter, 'open')
        .returns({ result: $q.when(true) });        
      run();
      controller.start();
      expect(stub.calledOnce).to.equal(true);
    });
    it('should start polling');
  });

  describe('.pause()', function() {
    it('should pause the environment', function() {
      var stub = sinon.stub(environment, '$pause');
      run();
      controller.pause();
      expect(stub.calledOnce).to.be.true;
    });
    it('should start polling');
  });

  describe('.redeploy()', function() {
    var EnvironmentRedeploy
      , $q;

    beforeEach(inject(function(_EnvironmentRedeploy_, _$q_) {
      EnvironmentRedeploy = _EnvironmentRedeploy_;
      $q = _$q_;
    }));

    it('should open the redeploy dialog', function() {
      var stub = sinon
        .stub(EnvironmentRedeploy, 'open')
        .returns({ result: $q.when(true) });        
      run();
      controller.redeploy();
      expect(stub.calledOnce).to.equal(true);
    });
    it('should start polling');
  });

  describe('.reset()', function() {
    it('should reset the environment', function() {
      var stub = sinon.stub(environment, '$reset');
      run();
      controller.reset();
      expect(stub.calledOnce).to.be.true;
    });
  });

  describe('.edit()', function() {
    var EnvironmentEditor;

    beforeEach(inject(function(_EnvironmentEditor_) {
      EnvironmentEditor = _EnvironmentEditor_;
    }));

    it('should open the environment editor for the current environment', function() { 
      var stub = sinon.stub(EnvironmentEditor, 'open');
      run();
      controller.edit();
      expect(stub.calledOnce).to.be.true;
      expect(stub.getCall(0).args[0]).to.equal(environment);
    });
  });

});