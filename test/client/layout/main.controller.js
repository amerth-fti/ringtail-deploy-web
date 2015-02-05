
describe('main.controller', function() {
  beforeEach(module('app'));  
  
  var $controller
    , Region
    , regions  
    , scope
    , globals
    , routeParams
    , controller
    , $routeParams
    ;

  regions = [ { regionId: 1 }, { regionId: 2 }];

  beforeEach(inject(function($rootScope, _$controller_, _Region_) {
    $controller = _$controller_;
    Region = _Region_;
    scope = $rootScope;
    routeParams = { regionId: 1 };
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

  });


  describe('when routeParam regionId changes', function() {
    it('the selected region changes', function() {      
      controller = $controller('MainController', { $scope: scope, globals: globals, $routeParams: routeParams, Region: Region });
      scope.vm.routeParams.regionId = 2;
      scope.$digest();
      expect(scope.vm.selectedRegion).to.equal(2);
    });
  });


});