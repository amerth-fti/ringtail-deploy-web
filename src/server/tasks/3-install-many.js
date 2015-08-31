var util    = require('util')
  , Q       = require('q')
  , _       = require('underscore')
  , Parallel    = require('./Parallel')
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
    var options  = scope.options
      , installs = options.installs
      ;

    // build the taskdefs for each install pair
    this.taskdefs = installs.map(function(install) {
      return {
        task: '3-install-machine',
        options: {
          name: install.machineName,
          machineId: install.machineId,
          configId: install.configId
        }
      };
    });

    // call the parent parellel version of execute
    return me.parentExecute();
  };
}

util.inherits(TaskImpl, Parallel);
module.exports = TaskImpl;
