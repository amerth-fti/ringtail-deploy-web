
describe('region-edit Directive', function() {
  beforeEach(module('templates'));
  beforeEach(module('app'));
  beforeEach(module('app.regions'));

  var $q
    , $rootScope
    , $routeParams    
    , $location
    , Region
    , controller
    , element
    ;

  beforeEach(inject(function(_$rootScope_, _$q_, _Region_, _$location_) {
    $rootScope = _$rootScope_;    
    $q = _$q_; 
    $location = _$location_;   
    Region = _Region_;
  }));

  beforeEach(function() {    
    sinon.stub(Region, 'get', function() {
      return new Region({ regionId: 1});
    });   
  });

  beforeEach(inject(function($compile) {
    element = angular.element('<region-edit region-id="1"></region-edit>');
    $compile(element)($rootScope);
    $rootScope.$digest();
    controller = element.controller('regionEdit');    
  }));

  describe('#activate', function() {
    it('loads the region', function() {
      expect(controller.region).to.be.an('object');
    });    
  });


  describe('#save', function() {
    var $update;

    beforeEach(function() {
      $update = sinon.stub(Region.prototype, '$update', function() {
        var deferred = $q.defer();
        deferred.resolve({ regionId: 1 });
        return deferred.promise;
      });
    });
    
    it('persists the region', function(done) {      
      controller.save().then(function() {
        expect($update.calledOnce).to.be.true;
        done();
      });
      $rootScope.$apply();
    });

    it('triggers a region-saved event', function(done) {
      var fired = false
        , eventRegion
        ;
      $rootScope.$on('region-saved', function(e, region) {
        fired = true;
        eventRegion = region;
      });
      controller.save().then(function() {
        expect(fired).to.be.true;
        expect(eventRegion.regionId).to.equal(1);
        done();
      });
      $rootScope.$apply();
    });

    it('triggers navigation to the display page', function(done) {
      var spy = sinon.spy($location, 'path');
      controller.save().then(function() {
        expect(spy.calledOnce).to.be.true;
        expect(spy.getCall(0).args[0]).to.equal('/app/regions/1');
        done();
      });
      $rootScope.$apply();
    });

  });


  describe('#cancel', function() {
    it('triggers navigation to the display page', function() {
      var spy = sinon.spy($location, 'path');
      controller.cancel();
      expect(spy.calledOnce).to.be.true;
      expect(spy.getCall(0).args[0]).to.equal('/app/regions/1');      
    });
  });

});