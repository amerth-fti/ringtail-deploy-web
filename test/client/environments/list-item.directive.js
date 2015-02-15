
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
  beforeEach(module('app.environments.starter'));

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

    it('sets showInitialize when status is "initialize"', function() {
      environment.status = 'initialize';
      run();
      expect(controller.showInitialize).to.be.true;
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

  describe('.start', function() {
    var EnvironmentStarter;

    beforeEach(inject(function(_EnvironmentStarter_) {
      EnvironmentStarter = _EnvironmentStarter_;
    }));

    it('should open the starter dialog', function() {
      var mock = sinon.stub(EnvironmentStarter, 'open');
      run();
      controller.start();
      expect(mock.calledOnce).to.equal(true);
    });

  });

  // describe('#newEnvironment', function() {
  //   var open;

  //   beforeEach(function() {
  //     open = sinon.stub(EnvironmentEditor, 'open', function() {
  //       var deferred = $q.defer();
  //       deferred.resolve({ envId: 2 });
  //       return { result: deferred.promise };    
  //     });
  //   });
    
  //   it('opens the editor', function(done) {
  //     controller.newEnvironment()
  //     .then(function() {
  //       expect(open.calledOnce).to.be.true;
  //       done();
  //     });
  //     $rootScope.$apply();
  //   });

  //   it('when resolved adds to environments', function(done) {
  //     controller.newEnvironment()
  //     .then(function() {
  //       expect(controller.environments.length).to.equal(2);
  //       done();
  //     });
  //     $rootScope.$apply();
  //   });

  //});
});