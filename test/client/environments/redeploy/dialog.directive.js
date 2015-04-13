
describe('Environment Redeploy Dialog Directive', function() {
  beforeEach(module('templates'));
  beforeEach(module('app'));
  beforeEach(module('shared.data'));
  beforeEach(module('app.environments.redeploy'));

  var environment
    , modalInstance
    , $rootScope
    , element
    , controller
    , stubBranches
    , stubBuilds
    ;


  // CREATE GLOBALLY ACCESSIBLE DEPENDENCIES
  beforeEach(inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
  }));


  // CREATE DEFAULT OBJECTS
  beforeEach(inject(function($q) {
    environment = {       
      envId: 1,
      config: { 
        taskdefs: [          
        ] 
      },
      $redeploy: sinon.stub().returns($q.when(environment))
    };
    modalInstance = {
      dismiss: sinon.stub(),
      close: sinon.stub()      
    };
  }));


  // CREATE STUBBED INITIAL REQUESTS
  beforeEach(inject(function(Browse) {
    stubBranches = sinon.stub(Browse, 'branches');
    stubBuilds = sinon.stub(Browse, 'builds');
  }));


  // SET ADDITOINAL ROOT SCOPE VALUES
  beforeEach(function() {
    $rootScope.routeParams = { regionId: 1 };
  });


  // CONSTRUCT THE DIRECTIVE
  beforeEach(inject(function($compile) {    

    // create the element
    element = angular.element('<env-redeploy environment="vm.environment" modal-instance="vm.modalInstance"></env-redeploy>');

    // create the element scope
    $rootScope.vm = {
      environment: environment,
      modalInstance: modalInstance
    };    

    // compile the element
    $compile(element)($rootScope);  
  }));


  // EXECUTES THE DIRECTIVE
  function run() {
    $rootScope.$digest();
    controller = element.controller('envRedeploy');
  }   


  describe('.activate', function() {
    it('should set the regionId to the routeParam', function() {
      run();      
      expect(controller.regionId).to.equal(1);
    });
    it('should create a copy of the environment so cancel works correctly', function() {
      run();      
      expect(controller.tempEnv).to.not.equal(environment);
      expect(controller.tempEnv.envId).to.equal(environment.envId);
    });    
    it('should not error if config is set', function() {
      environment.config = null;
      run();      
    });
    it('should copy the tasks defs to selectedTasks', function() {
      run();
      expect(controller.selectedTasks).to.be.instanceOf(Array);
      expect(controller.selectedTasks).to.not.equal(environment.config.taskdefs);
    });

    describe('when loading the branches', function() {
      it('should load the branches', function() {
        run();
        expect(stubBranches.calledOnce).to.be.true;      
      });    
      it('should indicate that branches are loading', function() {        
        run();        
        expect(controller.loadingBranches).to.be.true;
      });
      it('should indicate that branches are done loading', function() {
        stubBranches.onCall(0).callsArgWith(1, [ ]);
        run();        
        expect(controller.loadingBranches).to.be.false;
      });
      it('should load the builds if a branch was selected', function() {        
        environment.deployedBranch = 'CONSOLIDATION';              
        stubBranches.onCall(0).callsArgWith(1, [ ]);
        run();        
        expect(stubBuilds.calledOnce).to.be.true;
      });
      it('sould set the branches to the sorted list', function() {        
        stubBranches.onCall(0).callsArgWith(1, [ 'bbb', 'ccc', 'aaa']);
        run();        
        expect(controller.branches[0]).to.equal('aaa');
        expect(controller.branches[1]).to.equal('bbb');
        expect(controller.branches[2]).to.equal('ccc');        
      });
    });    

    describe('when environment.deployedBranch is a string', function() {
      it('should set selectedBranch.branch property', function() {
        environment.deployedBranch = 'CONSOLIDATION';
        run();
        expect(controller.selectedBranch.branch).to.equal('CONSOLIDATION');
      });  
    });

    describe('when environment.deployedBranch is a path', function() {
      it('should set selectedBranch.branch property ', function() {
        environment.deployedBranch = 'CONSOLIDATION\\20150401.1';
        run();        
        expect(controller.selectedBranch.branch).to.equal('CONSOLIDATION');
      });      
      it('should set selectedBranch.build property to null', function() {
        environment.deployedBranch = 'CONSOLIDATION\\20150401.1';
        run();        
        expect(controller.selectedBranch.build).to.equal(null);
      });
    });

    describe('.hasRpf ', function() {
      var roleAssertions = {
        'ALLINONE': true,
        'DATABASE': false,
        'AGENT': false,
        'WEB': false,
        'RPF-COORDINATOR': true,
        'RPF-SUPERVISOR': true,
        'SKYTAP-ALLINONE': true,
        'SKYTAP-DATABASE': false,
        'SKYTAP-AGENT': false,
        'SKYTAP-WEB': false,
        'SKYTAP-RPF-COORDINATOR': true,
        'SKYTAP-RPF-SUPERVISOR': true
      };      

      describe('with single machine', function() {      
        beforeEach(function() {
          environment.config.taskdefs[0] = {
            task: '3-custom-ringtail',
            options: { data: { config: { } } }
          };
        });  

        for(var role in roleAssertions) {
          if(roleAssertions.hasOwnProperty(role)) {          
            var assertion = roleAssertions[role]
              , title = 'should be ' + assertion + ' for ' + role
              ;

            /*jshint es5:false */
            /*jshint loopfunc:true */
            it(title, function() {
              environment.config.taskdefs[0].options.data.config['RoleResolver|ROLE'] = role;
              run();
              expect(controller.hasRpf).to.equal(assertion);
            });
            /*jshint loopfunc:false*/
          }          
        }
      });    

      describe('with multiple machine', function() {
        beforeEach(function() {
          environment.config.taskdefs[0] = {
            task: 'parallel',
            options: {
              taskdefs: [
                {
                  task: '3-custom-ringtail',
                  options: { data: { config: { } } }
                }
              ]
            }
          };
        });  

        for(var role in roleAssertions) {
          if(roleAssertions.hasOwnProperty(role)) {          
            var assertion = roleAssertions[role]
              , title = 'should be ' + assertion + ' for ' + role
              ;

            /*jshint es5:false */
            /*jshint loopfunc:true */
            it(title, function() {
              environment.config.taskdefs[0].options.taskdefs[0].options.data.config['RoleResolver|ROLE'] = role;
              run();
              expect(controller.hasRpf).to.equal(assertion);
            });
            /*jshint loopfunc:false*/
          }          
        }
      });
    });

  });

  describe('.cancel', function() {
    it('should dismiss the modal', function() {
      run();
      controller.cancel();
      expect(modalInstance.dismiss.calledOnce).to.be.true;
    });
  });
  
  describe('.rebuild', function() {
    it('should copy the tempEnv to the scoped environment', function() {
      run();
      controller.tempEnv.envName = 'test changed';
      controller.rebuild();      
      expect(controller.tempEnv).to.not.equal(controller.environment);
      expect(controller.environment.envName).to.equal('test changed');
    });
    it('should set environment.deployedBranch to a branch', function() {
      run();
      controller.selectedBranch = { branch: 'CONSOLIDATION', build: null };
      controller.rebuild();        
      expect(controller.environment.deployedBranch).to.equal('CONSOLIDATION');
    });
    it('should set environment.deployedBranch to a branch + build', function() {
      run();
      controller.selectedBranch = { branch: 'CONSOLIDATION', build: '20150401.1' };
      controller.rebuild();        
      expect(controller.environment.deployedBranch).to.equal('CONSOLIDATION\\20150401.1');
    });    
    it('should call environment.$redeploy', function() {
      run();
      controller.rebuild();      
      expect(controller.environment.$redeploy.calledOnce).to.be.true;
    });
    it('should pass the keepRpfwInstalls flag to environment.$redeploy', function() {
      run();
      controller.rebuild();
      expect(controller.environment.$redeploy.getCall(0).args[0].keepRpfwInstalls).to.be.true;
    });
    it('should pass the wipeRpfWorkers flag to environment.$redeploy', function() {
      run();
      controller.rebuild();
      expect(controller.environment.$redeploy.getCall(0).args[0].wipeRpfWorkers).to.be.true;
    });
    it('should close the modal and pass the environment', function() {
      run();
      controller.rebuild();
      $rootScope.$apply();
      expect(controller.modalInstance.close.calledOnce).to.be.true;
      expect(controller.modalInstance.close.getCall(0).args[0].envId).to.equal(environment.envId);
    });
    it('should redirect to the job', inject(function($location) {
      var locationStub = sinon.stub($location, 'path');
      controller.environment.deployedJobId = 1;
      run();
      controller.rebuild();      
      $rootScope.$apply();
      expect(locationStub.calledOnce).to.be.true;
      expect(locationStub.getCall(0).args[0]).to.equal('/app/jobs/1');
    }));
  });

  describe('.toggleAdvanced', function() {
    it('should set vm.showAdvanced to true when it is false', function() {
      controller.showAdvanced = false;
      run();
      controller.toggleAdvanced();
      expect(controller.showAdvanced).to.be.true;
    });
    it('should set vm.showAdvanced to false when it is true', function() {      
      run();
      controller.showAdvanced = true;
      controller.toggleAdvanced();
      expect(controller.showAdvanced).to.be.false;
    });
  });

  describe('.toggleSelectedTask', function() {
    beforeEach(function() {      
      environment.config.taskdefs[0] = { task: '1' };
      environment.config.taskdefs[1] = { task: '2' };     
    });

    it('should remove from selectedTasks if it is included', function() {
      run();
      expect(controller.selectedTasks.length).to.equal(2);
      controller.toggleSelectedTask(controller.tempEnv.config.taskdefs[0]);
      expect(controller.selectedTasks.length).to.equal(1);
      expect(controller.selectedTasks[0].task).to.equal('2');
    });
    it('should add to vm.selectedTasks if it isn\'t included', function() {
      run();
      controller.selectedTasks.pop();
      expect(controller.selectedTasks.length).to.equal(1);
      controller.toggleSelectedTask(environment.config.taskdefs[0]);
      expect(controller.selectedTasks.length).to.equal(2);
      expect(controller.selectedTasks[0].task).to.equal('1');
      expect(controller.selectedTasks[0].task).to.equal('1');
    });
  });

  describe('.branchChanged', function() {    
    it('should call Browse.builds with the region and selected branch', function() {              
      run();      
      controller.selectedBranch.branch = 'CONSOLIDATION';
      controller.branchChanged();
      expect(stubBuilds.calledOnce).to.be.true;
      expect(stubBuilds.getCall(0).args[0].regionId).to.equal(1);
      expect(stubBuilds.getCall(0).args[0].branch).to.equal('CONSOLIDATION');
    });
    it('should set the builds on vm.builds', function() {
      stubBuilds.onCall(0).callsArgWith(1, [ '20150401.1' ]);
      run();
      controller.selectedBranch.branch = 'CONSOLIDATION';
      controller.branchChanged();
      expect(controller.builds).to.be.instanceOf(Array);
      expect(controller.builds[0]).to.equal('20150401.1');
    });
    it('should indicate that the builds are loading', function() {      
      run();
      controller.selectedBranch.branch = 'CONSOLIDATION';
      controller.branchChanged();
      expect(controller.loadingBuilds).to.be.true;
    });
    it('should indicate that builds are done loading', function() {
      stubBuilds.onCall(0).callsArgWith(1, [ ]);
      run();
      controller.selectedBranch.branch = 'CONSOLIDATION';
      controller.branchChanged();      
      expect(controller.loadingBuilds).to.be.false;
    });
    it('should sorted builds', function() {
      stubBuilds.onCall(0).callsArgWith(1, [ '20150401.3', '20150331.1', '20150401.1' ]);
      run();
      controller.selectedBranch.branch = 'CONSOLIDATION';
      controller.branchChanged();
      expect(controller.builds).to.be.instanceOf(Array);
      expect(controller.builds[0]).to.equal('20150331.1');
      expect(controller.builds[1]).to.equal('20150401.1');
      expect(controller.builds[2]).to.equal('20150401.3');
    });
  });

});