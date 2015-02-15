
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

    it('sets showStart is true when runstate is "suspended"', function() {
      environment.runstate = 'suspended';
      run();
      expect(controller.showStart).to.be.true;
    });

    it('sets showStart to true when runstate is "stopped"', function() {
      environment.runstate = 'stopped';
      run();
      expect(controller.showStart).to.be.true;
    });

    it('sets showButtons when status is "deployed"', function() {
      environment.status = 'deployed';
      run();
      expect(controller.showButtons).to.be.true;
    });

    it('sets showDeployLink when status is "deploying"', function() {
      environment.status = 'deploying';
      run();
      expect(controller.showDeployLink).to.be.true;
    });

    it('polls when environment state is busy');

    it('polls when environment is deploying');

  });

  describe('.start()', function() {
    var EnvironmentStarter;

    beforeEach(inject(function(_EnvironmentStarter_) {
      EnvironmentStarter = _EnvironmentStarter_;
    }));

    it('should open the starter dialog', function() {
      var stub = sinon.stub(EnvironmentStarter, 'open');
      run();
      controller.start();
      expect(stub.calledOnce).to.equal(true);
    });

  });

  describe('.pause()', function() {
    it('should pause the environment', function() {
      var stub = sinon.stub(environment, '$pause');
      run();
      controller.pause();
      expect(stub.calledOnce).to.be.true;
    });
  });

  describe('.redeploy()', function() {

    it('should open the redeploy dialog');

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