
describe('environment-list Directive', function() {
  beforeEach(module('templates'));
  beforeEach(module('app'));
  beforeEach(module('app.environments', function($provide) {
    $provide.factory('listItemDirective', function() { return {}; });
  }));

  var element
    , environments = [ {} ]    
    , controller
    ;

  beforeEach(inject(function($rootScope, $compile) {    
    element = angular.element('<environments-list environments="vm.environments"></environments-list>');
    var scope = $rootScope;
    scope.vm = { 
      environments: environments
    };
    $compile(element)(scope);
    scope.$digest();

    controller = element.controller('environmentsList');    
  }));    

  describe('#activate', function() {
    it('renders the environments', function() {
      expect(controller.environments).to.be.an('array');
      expect(controller.environments).to.equal(environments);
    });
  });
  
});