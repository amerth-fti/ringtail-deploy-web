
describe('MainController', function() {
  beforeEach(module('app'));  
  
  var $controller
    , Region
    , regions  
    , scope
    , globals
    , controller
    , $routeParams
    ;

  regions = [ { regionId: 1 }, { regionId: 2 }];

  beforeEach(inject(function(_$controller_, _Region_) {
    $controller = _$controller_;
    Region = _Region_;
    scope = {};
    globals = {};      

    sinon.stub(Region, 'query', function() {
      return regions;      
    });    
  }));
  
  describe('initialize', function() {    
    

    it('sets the globals variable to the root scope', function() {      
      controller = $controller('MainController', { $scope: scope, globals: globals, Region: Region });
      expect(scope.globals).to.equal(globals);
    });

    it('retrieves the regions', function() {
      controller = $controller('MainController', { $scope: scope, globals: globals, Region: Region });
      expect(scope.vm.regions).to.equal(regions);
    });

    it('uses uses the default region when no region available', function() {      
      $routeParams = { };      
      controller = $controller('MainController', { $scope: scope, globals: globals, Region: Region, $routeParams: $routeParams });
      expect(scope.vm.selectedRegion).to.equal(1);
    });

    it('uses the current region when region specified', function() {
      $routeParams = { regionId: 2 };      
      controller = $controller('MainController', { $scope: scope, globals: globals, Region: Region, $routeParams: $routeParams });
      expect(scope.vm.selectedRegion).to.equal(2);
    });
  });


  describe('changeRegion', function() {
    it('changes the selected region', function() {

      controller = $controller('MainController', { $scope: scope, globals: globals, Region: Region, $routeParams: $routeParams });
      scope.vm.changeRegion({ regionId: 2 });
      expect(scope.vm.selectedRegion).to.equal(2);

    });
  });


});