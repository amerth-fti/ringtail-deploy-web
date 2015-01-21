
describe('EnvironmentListContrller', function() {
  beforeEach(module('app'));
  beforeEach(module('app.environments'));

  var $controller
    , $q
    , $rootScope
    , Environment
    , EnvironmentEditor
    , controller
    ;

  beforeEach(inject(function(_$controller_, _$q_, _$rootScope_, _Environment_, _EnvironmentEditor_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    Environment = _Environment_;
    EnvironmentEditor = _EnvironmentEditor_;
  }));

  beforeEach(function() {
    sinon.stub(Environment, 'query', function() {
      return [ { envId: 1 } ];
    });
    controller = $controller('EnvironmentListController', { Environment: Environment, EnvironmentEditor: EnvironmentEditor });
  });

  describe('#activate', function() {
    it('loads the environments from the resource', function() {
      expect(controller.environments).to.be.an('array');
      expect(controller.environments.length).to.equal(1);
    });
  });

  describe('#newEnvironment', function() {
    var open;

    beforeEach(function() {
      open = sinon.stub(EnvironmentEditor, 'open', function() {
        var deferred = $q.defer();
        deferred.resolve({ envId: 2 });
        return { result: deferred.promise };    
      });
    });
    
    it('opens the editor', function(done) {
      controller.newEnvironment()
      .then(function() {
        expect(open.calledOnce).to.be.true;
        done();
      });
      $rootScope.$apply();
    });

    it('when resolved adds to environments', function(done) {
      controller.newEnvironment()
      .then(function() {
        expect(controller.environments.length).to.equal(2);
        done();
      });
      $rootScope.$apply();
    });

  });
});