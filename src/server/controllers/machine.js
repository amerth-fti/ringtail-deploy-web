let debug = require('debug')('deployer-configs')  
  , _     = require('underscore')
  , machineSvc = require('../services/machine-service')
  ;

exports.updateIP = async function(req, res, next) {
    let machineId = req.params.machineId;
    let ip = req.params.ip;

    try {
        let machine = await machineSvc.get(machineId);
        machine.intIP = ip;
        await machineSvc.update(machine);

        res.result = {success: true};

    } catch (err) {
        res.result = {success: false};
        res.err = err;
    }

    next();
}