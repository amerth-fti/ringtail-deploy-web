
describe('main.controller', function() {
  beforeEach(module('app'));  
  
  var controller    
    , regions = [ { regionId: 1 }, { regionId: 2 }]
    ;


  beforeEach(inject(function(Region) {
    sinon.stub(Region, 'query', function() {   
      return regions;      
    });    
  }));


  beforeEach(inject(function($controller, $rootScope, Region) {
    controller = $controller('MainController', { $rootScope: $rootScope, Region: Region });
  }));

  
  describe('.activate', function() {      
    it('retrieves the regions', function() {      
      expect(controller.regions).to.equal(regions);
    });    
  });


  describe('when routeParam regionId changes', function() {
    it('the selected region changes', inject(function($rootScope, $routeParams) {            
      $routeParams.regionId = 2;
      $rootScope.$digest();
      expect(controller.selectedRegion).to.equal(2);
    }));
  });


  describe('when rootScope emits region-saved', function() {   
    it('updates the existing region', inject(function($rootScope) {
      expect(controller.regions[0].regionName).to.be.undefined;

      $rootScope.$emit('region-saved', { regionId: 1, regionName: 'test' });
      expect(controller.regions[0].regionName).to.equal('test');
    }));
  });

});