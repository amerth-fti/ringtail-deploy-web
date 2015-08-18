
describe('region-details Directive', function() {
  beforeEach(module('templates'));
  beforeEach(module('app'));
  beforeEach(module('app.regions', function($provide) {
    $provide.factory('environmentsListDirective', function() { return {}; });
  }));

  var $q
    , $rootScope
    , $routeParams
    , Environment
    , EnvironmentEditor
    , Region
    , controller
    , element
    ;

  beforeEach(inject(function(_$rootScope_, _$q_, _Environment_, _EnvironmentEditor_, _Region_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    Environment = _Environment_;
    EnvironmentEditor = _EnvironmentEditor_;
    Region = _Region_;
  }));

  beforeEach(function() {
    sinon.stub(Region, 'get', function() {
      return { regionId: 1 };
    });

    sinon
      .stub(Environment, 'region')
      .yields([{ envId: 1 }], sinon.stub());
  });

  beforeEach(inject(function($compile) {
    element = angular.element('<region-details region-id="1"></region-details>');
    $compile(element)($rootScope);
    $rootScope.$digest();

    controller = element.controller('regionDetails');
  }));

  describe('#activate', function() {
    it('loads the region', function() {
      expect(controller.region).to.be.an('object');
    });
    it('loads the environments', function() {
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