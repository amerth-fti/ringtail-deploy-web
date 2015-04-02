
describe('Environment Redeploy Dialog Factory', function() {
  beforeEach(module('templates'));
  beforeEach(module('app'));
  beforeEach(module('app.environments.redeploy', function($provide) {
    $provide.factory('envRedeployDirective', function() { return {}; });
  }));

  var environment = { envId: 1 }
    , $rootScope
    , sut
    ;

  beforeEach(inject(function(_$rootScope_, $compile, EnvironmentRedeploy) {
    sut = EnvironmentRedeploy;
    $rootScope = _$rootScope_;    
  }));    

  describe('.open', function() {
    it('should set vm.environment', function() {
      var result = sut.open(environment);      
      $rootScope.$digest();       
      expect(result.controller.environment).to.equal(environment);
    });
    it('should set vm.modalInstance', function() {
      var result = sut.open(environment);      
      $rootScope.$digest();       
      expect(result.controller.modalInstance).to.equal(result);
    });
  });
  
});