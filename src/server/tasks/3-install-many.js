var util    = require('util')
  , Q       = require('q')
  , _       = require('underscore')
  , Parallel    = require('./parallel')
  , machineSvc  = require('../services/machine-service')
  ;

function TaskImpl(options) {
  Parallel.call(this, options);
  var me = this;
  me.name = 'Install Ringtail';

  // cache the execute method from the parent
  me.parentExecute = me.execute;

  // override the execute method
  me.execute = function execute(scope, log) {
    return Q.fcall(function() {
      var installs = options.installs
        , env      = scope.me
        , installOptsArray
        ;

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
        throw new Error('Install type of ' + installs + ' is not supported');

      // build the taskdefs for each install pair
      me.taskdefs = installOptsArray.map(function(installOpts) {
        return {
          task: '3-install-machine',
          options: installOpts
        };
      });

      // call the parent parellel version of execute
      return me.parentExecute(scope, log);
    });
  };
}

util.inherits(TaskImpl, Parallel);
module.exports = TaskImpl;
