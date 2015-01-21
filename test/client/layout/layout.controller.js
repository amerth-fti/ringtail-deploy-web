
describe('MainController', function() {
  beforeEach(module('app'));
  
  var $controller;

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  describe('initialize', function() {    
    it('sets the globals variable to the scope', function() {
      var scope = {}
        , globals = {}
        , controller;

      controller = $controller('MainController', { $scope: scope, globals: globals });          

      expect(scope.globals).to.equal(globals);
    });
  });
});