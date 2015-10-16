describe('TaskDef Service', function() {
  beforeEach(module('underscore'));
  beforeEach(module('app.environments.taskdefs'));
  var sut;


  beforeEach(inject(function($injector) {
    sut = $injector.get( 'TaskDef' );
  }));

  describe('.create', function() {
    it('should create single taskdef', function() {
      var result = sut.create();
      expect(result.taskdefs.length).to.equal(1);
    });
    describe('taskdef', function(){
      it('should be 3-install-many', function() {
        var result  = sut.create()
          , taskdef = result.taskdefs[0]
          ;
        expect(taskdef.task).to.equal('3-install-many');
      });
      it('should set \'installs\' option to \'all\'', function() {
        var result  = sut.create()
          , taskdef = result.taskdefs[0]
          ;
        expect(taskdef.options.installs).to.equal('all');
      });
    });
  });

  describe('.addTask', function() {
    var environment;

    beforeEach(function() {
      environment = {
        'config': {
          'taskdefs': [ {} ]
        }
      };
    });

    it('should add a new taskdef', function() {
      sut.addTask(environment);
      expect(environment.config.taskdefs.length).to.equal(2);
    });
  });

  // describe('.getEnvTaskDefs', function() {
  //   it('should return the taskdefs when there is a configuration', function() {
  //     /* jshint es5:false */
  //     /* jshint ignore:start */
  //     var env = {
  //       config: {
  //         taskdefs: [{"task":"1-test","options":{"name":"Skip1"}},{"task":"3-custom-ringtail","options":{"name":"Install1","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB","Common|IS_SQLSERVER_USERNAME":"sa","Common|IS_SQLSERVER_PASSWORD":"password","Common|IS_SQLSERVER_SERVER":"Test","Common|IS_SQLSERVER_DATABASE":"Portal","Common|RPFWORKERPATH":"\\\\192.168.0.1\\RPF_Workers","Common|SELFSERVICEAUTHENTICATIONMODE":"Ringtail","Common|IISAUTHENTICATIONMETHOD":"Forms","Common|RINGTAILUISTATICCONTENTURL":"https://site/UIStatic","Common|RINGTAILSTSURL":"https://site/RingtailSTS","Common|RINGTAILIISWEBAPPLICATIONURL":"https://site/Ringtail","Common|RINGTAILURL":"https://site/Ringtail","Common|RINGTAILHELPURL":"https://site/RingtailHelp","Common|RINGTAILCLASSICURL":"https://site/classic","Common|RINGTAILLEGALURL":"https://site/classic","Common|LEGALPATH":"classic","Common|RMCIISWEBAPPLICATIONURL":"https://site/RMC","Common|WEBBROWSERPROTOCOL":"https","Common|SSLUSAGEPROPERTY":"true","RingtailConfigurator|HOST":"localhost","RingtailConfigurator|NT_DOMAIN":"company","RingtailConfigurator|NT_USER":"user","RingtailConfigurator|NT_PASSWORD":"pass","RingtailConfigurator|CONFIG_USERNAME":"user","RingtailConfigurator|CONFIG_PASSWORD":"pass"}}}}]
  //       }
  //     };
  //     var result = sut.getEnvTaskDefs(env);
  //     expect(result.length).to.equal(2);
  //     /* jshint ignore:end */
  //   });
  // });


  // describe('.getEnvTaskDefForRole', function() {
  //   it('should return the matching TaskDef in the role', function() {
  //     /* jshint es5:false */
  //     /* jshint ignore:start */
  //     var env = { config: { taskdefs: [{"task":"1-test","options":{"name":"Skip1"}},{"task":"3-custom-ringtail","options":{"name":"Install1","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB","Common|IS_SQLSERVER_USERNAME":"sa","Common|IS_SQLSERVER_PASSWORD":"password","Common|IS_SQLSERVER_SERVER":"Test","Common|IS_SQLSERVER_DATABASE":"Portal","Common|RPFWORKERPATH":"\\\\192.168.0.1\\RPF_Workers","Common|SELFSERVICEAUTHENTICATIONMODE":"Ringtail","Common|IISAUTHENTICATIONMETHOD":"Forms","Common|RINGTAILUISTATICCONTENTURL":"https://site/UIStatic","Common|RINGTAILSTSURL":"https://site/RingtailSTS","Common|RINGTAILIISWEBAPPLICATIONURL":"https://site/Ringtail","Common|RINGTAILURL":"https://site/Ringtail","Common|RINGTAILHELPURL":"https://site/RingtailHelp","Common|RINGTAILCLASSICURL":"https://site/classic","Common|RINGTAILLEGALURL":"https://site/classic","Common|LEGALPATH":"classic","Common|RMCIISWEBAPPLICATIONURL":"https://site/RMC","Common|WEBBROWSERPROTOCOL":"https","Common|SSLUSAGEPROPERTY":"true","RingtailConfigurator|HOST":"localhost","RingtailConfigurator|NT_DOMAIN":"company","RingtailConfigurator|NT_USER":"user","RingtailConfigurator|NT_PASSWORD":"pass","RingtailConfigurator|CONFIG_USERNAME":"user","RingtailConfigurator|CONFIG_PASSWORD":"pass"}}}}]}};
  //     var result = sut.getEnvTaskDefForRole(env, 'WEB');
  //     expect(result).to.be.an('object');
  //     expect(result.options.name).to.equal('Install1');
  //     /* jshint ignore:end */
  //   });
  // });


  // describe('.getKeyValuePairs', function() {
  //   it('should return key/value pairs for the TaskDef\'s config data', function() {
  //     /* jshint es5:false */
  //     /* jshint ignore:start */
  //     var taskdef = {"task":"3-custom-ringtail","options":{"name":"Install1","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB","Common|IS_SQLSERVER_USERNAME":"sa","Common|IS_SQLSERVER_PASSWORD":"password","Common|IS_SQLSERVER_SERVER":"Test","Common|IS_SQLSERVER_DATABASE":"Portal","Common|RPFWORKERPATH":"\\\\192.168.0.1\\RPF_Workers","Common|SELFSERVICEAUTHENTICATIONMODE":"Ringtail","Common|IISAUTHENTICATIONMETHOD":"Forms","Common|RINGTAILUISTATICCONTENTURL":"https://site/UIStatic","Common|RINGTAILSTSURL":"https://site/RingtailSTS","Common|RINGTAILIISWEBAPPLICATIONURL":"https://site/Ringtail","Common|RINGTAILURL":"https://site/Ringtail","Common|RINGTAILHELPURL":"https://site/RingtailHelp","Common|RINGTAILCLASSICURL":"https://site/classic","Common|RINGTAILLEGALURL":"https://site/classic","Common|LEGALPATH":"classic","Common|RMCIISWEBAPPLICATIONURL":"https://site/RMC","Common|WEBBROWSERPROTOCOL":"https","Common|SSLUSAGEPROPERTY":"true","RingtailConfigurator|HOST":"localhost","RingtailConfigurator|NT_DOMAIN":"company","RingtailConfigurator|NT_USER":"user","RingtailConfigurator|NT_PASSWORD":"pass","RingtailConfigurator|CONFIG_USERNAME":"user","RingtailConfigurator|CONFIG_PASSWORD":"pass"}}}};
  //     var result = sut.getKeyValuePairs(taskdef);
  //     expect(result).to.be.an('object');
  //     expect(result['Common|IS_SQLSERVER_USERNAME']).to.equal('sa');
  //     /* jshint ignore:end */
  //   });
  // });


  // describe('.findInstallTaskDefs', function() {
  //   it('should read a single install tasks in a list of tasks', function() {
  //     /* jshint es5:false */
  //     /* jshint ignore:start */
  //     var data = [{"task":"1-test","options":{"name":"Skip1"}},{"task":"3-custom-ringtail","options":{"name":"Install1","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB","Common|IS_SQLSERVER_USERNAME":"sa","Common|IS_SQLSERVER_PASSWORD":"password","Common|IS_SQLSERVER_SERVER":"Test","Common|IS_SQLSERVER_DATABASE":"Portal","Common|RPFWORKERPATH":"\\\\192.168.0.1\\RPF_Workers","Common|SELFSERVICEAUTHENTICATIONMODE":"Ringtail","Common|IISAUTHENTICATIONMETHOD":"Forms","Common|RINGTAILUISTATICCONTENTURL":"https://site/UIStatic","Common|RINGTAILSTSURL":"https://site/RingtailSTS","Common|RINGTAILIISWEBAPPLICATIONURL":"https://site/Ringtail","Common|RINGTAILURL":"https://site/Ringtail","Common|RINGTAILHELPURL":"https://site/RingtailHelp","Common|RINGTAILCLASSICURL":"https://site/classic","Common|RINGTAILLEGALURL":"https://site/classic","Common|LEGALPATH":"classic","Common|RMCIISWEBAPPLICATIONURL":"https://site/RMC","Common|WEBBROWSERPROTOCOL":"https","Common|SSLUSAGEPROPERTY":"true","RingtailConfigurator|HOST":"localhost","RingtailConfigurator|NT_DOMAIN":"company","RingtailConfigurator|NT_USER":"user","RingtailConfigurator|NT_PASSWORD":"pass","RingtailConfigurator|CONFIG_USERNAME":"user","RingtailConfigurator|CONFIG_PASSWORD":"pass"}}}}];
  //     var result = sut.findInstallTaskDefs(data);
  //     expect(result.length).to.equal(1);
  //     expect(result[0].options.name).to.equal('Install1');
  //     /* jshint ignore:end */
  //   });

  //   it('should read many install tasks in a list of tasks', function() {
  //     /* jshint es5:false */
  //     /* jshint ignore:start */
  //     var data = [{"task":"1-test","options":{"name":"Skip1"}},{"task":"3-custom-ringtail","options":{"name":"Install1","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB","Common|IS_SQLSERVER_USERNAME":"sa","Common|IS_SQLSERVER_PASSWORD":"password","Common|IS_SQLSERVER_SERVER":"Test","Common|IS_SQLSERVER_DATABASE":"Portal","Common|RPFWORKERPATH":"\\\\192.168.0.1\\RPF_Workers","Common|SELFSERVICEAUTHENTICATIONMODE":"Ringtail","Common|IISAUTHENTICATIONMETHOD":"Forms","Common|RINGTAILUISTATICCONTENTURL":"https://site/UIStatic","Common|RINGTAILSTSURL":"https://site/RingtailSTS","Common|RINGTAILIISWEBAPPLICATIONURL":"https://site/Ringtail","Common|RINGTAILURL":"https://site/Ringtail","Common|RINGTAILHELPURL":"https://site/RingtailHelp","Common|RINGTAILCLASSICURL":"https://site/classic","Common|RINGTAILLEGALURL":"https://site/classic","Common|LEGALPATH":"classic","Common|RMCIISWEBAPPLICATIONURL":"https://site/RMC","Common|WEBBROWSERPROTOCOL":"https","Common|SSLUSAGEPROPERTY":"true","RingtailConfigurator|HOST":"localhost","RingtailConfigurator|NT_DOMAIN":"company","RingtailConfigurator|NT_USER":"user","RingtailConfigurator|NT_PASSWORD":"pass","RingtailConfigurator|CONFIG_USERNAME":"user","RingtailConfigurator|CONFIG_PASSWORD":"pass"}}}},{"task":"3-custom-ringtail","options":{"name":"Install2","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB","Common|IS_SQLSERVER_USERNAME":"sa","Common|IS_SQLSERVER_PASSWORD":"password","Common|IS_SQLSERVER_SERVER":"Test","Common|IS_SQLSERVER_DATABASE":"Portal","Common|RPFWORKERPATH":"\\\\192.168.0.1\\RPF_Workers","Common|SELFSERVICEAUTHENTICATIONMODE":"Ringtail","Common|IISAUTHENTICATIONMETHOD":"Forms","Common|RINGTAILUISTATICCONTENTURL":"https://site/UIStatic","Common|RINGTAILSTSURL":"https://site/RingtailSTS","Common|RINGTAILIISWEBAPPLICATIONURL":"https://site/Ringtail","Common|RINGTAILURL":"https://site/Ringtail","Common|RINGTAILHELPURL":"https://site/RingtailHelp","Common|RINGTAILCLASSICURL":"https://site/classic","Common|RINGTAILLEGALURL":"https://site/classic","Common|LEGALPATH":"classic","Common|RMCIISWEBAPPLICATIONURL":"https://site/RMC","Common|WEBBROWSERPROTOCOL":"https","Common|SSLUSAGEPROPERTY":"true","RingtailConfigurator|HOST":"localhost","RingtailConfigurator|NT_DOMAIN":"company","RingtailConfigurator|NT_USER":"user","RingtailConfigurator|NT_PASSWORD":"pass","RingtailConfigurator|CONFIG_USERNAME":"user","RingtailConfigurator|CONFIG_PASSWORD":"pass"}}}}];
  //     var result = sut.findInstallTaskDefs(data);
  //     expect(result.length).to.equal(2);
  //     /* jshint ignore:end */
  //   });

  //   it('should read install tasks inside a parallel task', function() {
  //     /* jshint es5:false */
  //     /* jshint ignore:start */
  //     var data = [{"task":"1-test","options":{"name":"Skip1"}},{"task":"parallel","options":{"name":"InstallRingtail","taskdefs":[{"task":"3-custom-ringtail","options":{"name":"Install1","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB","Common|IS_SQLSERVER_USERNAME":"sa","Common|IS_SQLSERVER_PASSWORD":"password","Common|IS_SQLSERVER_SERVER":"Test","Common|IS_SQLSERVER_DATABASE":"Portal","Common|RPFWORKERPATH":"\\\\192.168.0.1\\RPF_Workers","Common|SELFSERVICEAUTHENTICATIONMODE":"Ringtail","Common|IISAUTHENTICATIONMETHOD":"Forms","Common|RINGTAILUISTATICCONTENTURL":"https://site/UIStatic","Common|RINGTAILSTSURL":"https://site/RingtailSTS","Common|RINGTAILIISWEBAPPLICATIONURL":"https://site/Ringtail","Common|RINGTAILURL":"https://site/Ringtail","Common|RINGTAILHELPURL":"https://site/RingtailHelp","Common|RINGTAILCLASSICURL":"https://site/classic","Common|RINGTAILLEGALURL":"https://site/classic","Common|LEGALPATH":"classic","Common|RMCIISWEBAPPLICATIONURL":"https://site/RMC","Common|WEBBROWSERPROTOCOL":"https","Common|SSLUSAGEPROPERTY":"true","RingtailConfigurator|HOST":"localhost","RingtailConfigurator|NT_DOMAIN":"company","RingtailConfigurator|NT_USER":"user","RingtailConfigurator|NT_PASSWORD":"pass","RingtailConfigurator|CONFIG_USERNAME":"user","RingtailConfigurator|CONFIG_PASSWORD":"pass"}}}},{"task":"3-custom-ringtail","options":{"name":"Install2","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB","Common|IS_SQLSERVER_USERNAME":"sa","Common|IS_SQLSERVER_PASSWORD":"password","Common|IS_SQLSERVER_SERVER":"Test","Common|IS_SQLSERVER_DATABASE":"Portal","Common|RPFWORKERPATH":"\\\\192.168.0.1\\RPF_Workers","Common|SELFSERVICEAUTHENTICATIONMODE":"Ringtail","Common|IISAUTHENTICATIONMETHOD":"Forms","Common|RINGTAILUISTATICCONTENTURL":"https://site/UIStatic","Common|RINGTAILSTSURL":"https://site/RingtailSTS","Common|RINGTAILIISWEBAPPLICATIONURL":"https://site/Ringtail","Common|RINGTAILURL":"https://site/Ringtail","Common|RINGTAILHELPURL":"https://site/RingtailHelp","Common|RINGTAILCLASSICURL":"https://site/classic","Common|RINGTAILLEGALURL":"https://site/classic","Common|LEGALPATH":"classic","Common|RMCIISWEBAPPLICATIONURL":"https://site/RMC","Common|WEBBROWSERPROTOCOL":"https","Common|SSLUSAGEPROPERTY":"true","RingtailConfigurator|HOST":"localhost","RingtailConfigurator|NT_DOMAIN":"company","RingtailConfigurator|NT_USER":"user","RingtailConfigurator|NT_PASSWORD":"pass","RingtailConfigurator|CONFIG_USERNAME":"user","RingtailConfigurator|CONFIG_PASSWORD":"pass"}}}}]}}];
  //     var result = sut.findInstallTaskDefs(data);
  //     expect(result.length).to.equal(2);
  //     /* jshint ignore:end */
  //   });

  //   it('should return install tasks in an ordinal position', function() {
  //     /* jshint es5:false */
  //     /* jshint ignore:start */
  //     var data = [{"task":"1-test","options":{"name":"Skip1"}},{"task":"parallel","options":{"name":"InstallRingtail","taskdefs":[{"task":"3-custom-ringtail","options":{"name":"Install1","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB","Common|IS_SQLSERVER_USERNAME":"sa","Common|IS_SQLSERVER_PASSWORD":"password","Common|IS_SQLSERVER_SERVER":"Test","Common|IS_SQLSERVER_DATABASE":"Portal","Common|RPFWORKERPATH":"\\\\192.168.0.1\\RPF_Workers","Common|SELFSERVICEAUTHENTICATIONMODE":"Ringtail","Common|IISAUTHENTICATIONMETHOD":"Forms","Common|RINGTAILUISTATICCONTENTURL":"https://site/UIStatic","Common|RINGTAILSTSURL":"https://site/RingtailSTS","Common|RINGTAILIISWEBAPPLICATIONURL":"https://site/Ringtail","Common|RINGTAILURL":"https://site/Ringtail","Common|RINGTAILHELPURL":"https://site/RingtailHelp","Common|RINGTAILCLASSICURL":"https://site/classic","Common|RINGTAILLEGALURL":"https://site/classic","Common|LEGALPATH":"classic","Common|RMCIISWEBAPPLICATIONURL":"https://site/RMC","Common|WEBBROWSERPROTOCOL":"https","Common|SSLUSAGEPROPERTY":"true","RingtailConfigurator|HOST":"localhost","RingtailConfigurator|NT_DOMAIN":"company","RingtailConfigurator|NT_USER":"user","RingtailConfigurator|NT_PASSWORD":"pass","RingtailConfigurator|CONFIG_USERNAME":"user","RingtailConfigurator|CONFIG_PASSWORD":"pass"}}}},{"task":"3-custom-ringtail","options":{"name":"Install2","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB","Common|IS_SQLSERVER_USERNAME":"sa","Common|IS_SQLSERVER_PASSWORD":"password","Common|IS_SQLSERVER_SERVER":"Test","Common|IS_SQLSERVER_DATABASE":"Portal","Common|RPFWORKERPATH":"\\\\192.168.0.1\\RPF_Workers","Common|SELFSERVICEAUTHENTICATIONMODE":"Ringtail","Common|IISAUTHENTICATIONMETHOD":"Forms","Common|RINGTAILUISTATICCONTENTURL":"https://site/UIStatic","Common|RINGTAILSTSURL":"https://site/RingtailSTS","Common|RINGTAILIISWEBAPPLICATIONURL":"https://site/Ringtail","Common|RINGTAILURL":"https://site/Ringtail","Common|RINGTAILHELPURL":"https://site/RingtailHelp","Common|RINGTAILCLASSICURL":"https://site/classic","Common|RINGTAILLEGALURL":"https://site/classic","Common|LEGALPATH":"classic","Common|RMCIISWEBAPPLICATIONURL":"https://site/RMC","Common|WEBBROWSERPROTOCOL":"https","Common|SSLUSAGEPROPERTY":"true","RingtailConfigurator|HOST":"localhost","RingtailConfigurator|NT_DOMAIN":"company","RingtailConfigurator|NT_USER":"user","RingtailConfigurator|NT_PASSWORD":"pass","RingtailConfigurator|CONFIG_USERNAME":"user","RingtailConfigurator|CONFIG_PASSWORD":"pass"}}}}]}},{"task":"3-custom-ringtail","options":{"name":"Install3","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB","Common|IS_SQLSERVER_USERNAME":"sa","Common|IS_SQLSERVER_PASSWORD":"password","Common|IS_SQLSERVER_SERVER":"Test","Common|IS_SQLSERVER_DATABASE":"Portal","Common|RPFWORKERPATH":"\\\\192.168.0.1\\RPF_Workers","Common|SELFSERVICEAUTHENTICATIONMODE":"Ringtail","Common|IISAUTHENTICATIONMETHOD":"Forms","Common|RINGTAILUISTATICCONTENTURL":"https://site/UIStatic","Common|RINGTAILSTSURL":"https://site/RingtailSTS","Common|RINGTAILIISWEBAPPLICATIONURL":"https://site/Ringtail","Common|RINGTAILURL":"https://site/Ringtail","Common|RINGTAILHELPURL":"https://site/RingtailHelp","Common|RINGTAILCLASSICURL":"https://site/classic","Common|RINGTAILLEGALURL":"https://site/classic","Common|LEGALPATH":"classic","Common|RMCIISWEBAPPLICATIONURL":"https://site/RMC","Common|WEBBROWSERPROTOCOL":"https","Common|SSLUSAGEPROPERTY":"true","RingtailConfigurator|HOST":"localhost","RingtailConfigurator|NT_DOMAIN":"company","RingtailConfigurator|NT_USER":"user","RingtailConfigurator|NT_PASSWORD":"pass","RingtailConfigurator|CONFIG_USERNAME":"user","RingtailConfigurator|CONFIG_PASSWORD":"pass"}}}}];
  //     var result = sut.findInstallTaskDefs(data);
  //     expect(result.length).to.equal(3);
  //     expect(result[0].options.name).to.equal('Install1');
  //     expect(result[1].options.name).to.equal('Install2');
  //     expect(result[2].options.name).to.equal('Install3');
  //     /* jshint ignore:end */
  //   });
  // });


  // describe('.findTaskDefForRole', function() {
  //   it('should return TaskDef for a role when only one TaskDef matches', function() {
  //     /* jshint es5:false */
  //     /* jshint ignore:start */
  //     var data = [{"task":"3-custom-ringtail","options":{"name":"Install1","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB1"}}}},{"task":"3-custom-ringtail","options":{"name":"Install2","data":{"machine":"scope.me.machines[1]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB2"}}}},{"task":"3-custom-ringtail","options":{"name":"Install3","data":{"machine":"scope.me.machines[2]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB3"}}}}];
  //     var result = sut.findTaskDefForRole(data, 'WEB2');
  //     expect(result.options.name).to.equal('Install2');
  //     /* jshint ignore:end */
  //   });

  //   it('should return first TaskDef for the role when more than one TaskDef matches', function() {
  //     /* jshint es5:false */
  //     /* jshint ignore:start */
  //     var data = [{"task":"3-custom-ringtail","options":{"name":"Install1","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB1"}}}},{"task":"3-custom-ringtail","options":{"name":"Install2","data":{"machine":"scope.me.machines[1]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB1"}}}},{"task":"3-custom-ringtail","options":{"name":"Install3","data":{"machine":"scope.me.machines[2]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB3"}}}}];
  //     var result = sut.findTaskDefForRole(data, 'WEB1');
  //     expect(result.options.name).to.equal('Install1');
  //     /* jshint ignore:end */
  //   });

  //   it('should return null when the role is not found', function() {
  //     /* jshint es5:false */
  //     /* jshint ignore:start */
  //     var data = [{"task":"3-custom-ringtail","options":{"name":"Install1","data":{"machine":"scope.me.machines[0]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB1"}}}},{"task":"3-custom-ringtail","options":{"name":"Install2","data":{"machine":"scope.me.machines[1]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB2"}}}},{"task":"3-custom-ringtail","options":{"name":"Install3","data":{"machine":"scope.me.machines[2]","branch":"scope.me.deployedBranch","config":{"ROLE":"WEB3"}}}}];
  //     var result = sut.findTaskDefForRole(data, 'NOT_FOUND');
  //     expect(result).to.be.null
  //     /* jshint ignore:end */
  //   });
  // });

});