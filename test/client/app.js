
describe('app module', function() {
  beforeEach(module('app'));  
  
  describe('.run', function() {      
    it('sets $rootScope.globals', inject(function($rootScope, globals) {             
      expect($rootScope.globals).to.equal(globals);
    }));
    it('sets $rootScope.routeParams', inject(function($rootScope, $routeParams) {
      expect($rootScope.routeParams).to.equal($routeParams);
    }));
  });

});