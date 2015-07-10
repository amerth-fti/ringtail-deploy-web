
describe('Ringtail Config Editor', function() {
  beforeEach(module('underscore'));
  beforeEach(module('templates'));
  beforeEach(module('app.environments.config'));

  var controller
    , element
    , config
    , host
    , $rootScope
    , Role
    , RingtailConfig
    , RingtailField
    , stubRoles
    ;

  // CREATE GLOBALLY ACCESSIBLE DEPENDENCIES
  beforeEach(inject(function(_$rootScope_, _Role_, _RingtailConfig_, _RingtailField_) {
    $rootScope = _$rootScope_;
    Role = _Role_;
    RingtailConfig = _RingtailConfig_;
    RingtailField = _RingtailField_;
  }));

  // CREATE DEFAULT OBJECTS
  beforeEach(inject(function($q) {
    config = {
      configId:1,
      configName:'WEB01',
      data:{
        'ROLE':'WEB',
        'Ringtail8|IS_SQLSERVER_SERVER':'dbserver',
        'Ringtail8|IS_SQLSERVER_USERNAME':'sasss',
        'Ringtail8|IS_SQLSERVER_PASSWORD':'password',
        'Ringtail8|IS_SQLSERVER_DATABASE':'portal'
      },
      roles:[
        'WEB'
      ]
    };
    host = 'localhost';
  }));


  // CREATE STUBBED INITIAL REQUESTS
  beforeEach(inject(function(Browse) {
    stubRoles = sinon.stub(Role, 'roles');
  }));


  // CONSTRUCT THE DIRECTIVE
  beforeEach(inject(function($compile) {

    // create the element
    element = angular.element('<config-editor config="vm.config" host="vm.host"></config-editor>');

    // create the element scope
    $rootScope.vm = {
      config: config,
      host: host
    };

    // compile the element
    $compile(element)($rootScope);
  }));


  // EXECUTES THE DIRECTIVE
  function run() {
    $rootScope.$digest();
    controller = element.controller('configEditor');
  }

  describe('.activate', function() {
    it('selects the first role', function() {
      run();
      expect(controller.selectedRole).to.equal(config.roles[0]); // WEB);
    });
    it('fetches the Roles', function() {
      run();
      expect(stubRoles.called).to.be.true;
    });
    it('initializes the fields', function() {
      run();
      expect(controller.fields).to.not.be.null;
    });
  });

  describe('.roleChanged', function() {
    it('sets the role on the config', function() {
      run();
      controller.selectedRole = 'DATABASE';
      controller.roleChanged();
      expect(controller.config.roles[0]).to.equal('DATABASE');
    });
    it('triggers a field rebuild', function() {
      var configs = [
        'RingtailDatabaseUtility|IS_SQLSERVER_SERVER',
        'RingtailDatabaseUtility|IS_SQLSERVER_USERNAME',
        'RingtailDatabaseUtility|IS_SQLSERVER_PASSWORD',
        'RingtailDatabaseUtility|IS_SQLSERVER_DATABASE',
        'DatabaseUpgrader|IS_SQLSERVER_SERVER',
        'DatabaseUpgrader|IS_SQLSERVER_USERNAME',
        'DatabaseUpgrader|IS_SQLSERVER_PASSWORD',
        'DatabaseUpgrader|DATACAMEL_ACTION',
        'DatabaseUpgrader|DATACAMEL_DATABASES'
      ];
      var configsForRole = sinon
            .stub(RingtailConfig, 'configsForRole')
            .returns(configs);
      run();
      controller.selectedRole = 'DATABASE';
      controller.roleChanged();
      expect(configsForRole.called).to.be.true;
    });
  });
});