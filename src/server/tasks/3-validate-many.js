var util            = require('util')
  , debug           = require('debug')('deployer-3-validate-many')
  , _               = require('underscore')
  , Parallel        = require('./parallel')
  , envService      = require('../services/env-service')
  , regionService   = require('../services/region-service')  
  ;

function TaskImpl(options) {
  Parallel.call(this, options);
  var me = this;
  me.name = 'Validate Deployment';

  // cache the execute method from the parent
  me.parentExecute = me.execute;

  // override the execute method
  me.execute = async function execute(scope, log) {
    let installs = options.installs
      , env      = scope.me
      , installOptsArray
      ;

    let regionId = await envService.findRegionByEnvId(env.envId);
    let region = await regionService.findById(regionId);

    // create install definitions for all of the machines
    // that have configId values set. This is used to
    // run the installation for all machines as opposed to
    // specific machines.
    if(installs === 'all') {
      installOptsArray = env.machines.map(function(machine) {
        if(machine.configId) {
          return {
            name: machine.machineName,
            machineId: machine.machineId,
            envId: env.envId,
            region: region,
            configId: machine.configId,
            data: {
              branch: 'scope.me.deployedBranch'
            }
          };
        }
      });
      installOptsArray = _.filter(installOptsArray, function(installOpts) {
        return !!installOpts;
      });
    }
    else
      throw new Error('Validation type of ' + installs + ' is not supported');

    // build the taskdefs for each install pair
    me.taskdefs = installOptsArray.map(function(installOpts) {
      return {
        task: '3-validate-machine',
        options: installOpts
      };
    });

    // call the parent parellel version of execute
    let response = await me.parentExecute(scope, log);
    return response;
  };
}

util.inherits(TaskImpl, Parallel);
module.exports = TaskImpl;
