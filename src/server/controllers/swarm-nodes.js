
let swarm = require('../services/swarm-service');

module.exports = {
  list,
  addLabel,
  removeLabel,
};

/**
 * [list description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
async function list(req, res) {
  let {swarmhost} = req.query;
  if(!swarmhost ) {
    res.send([]);
  }

  let nodes = await swarm.getNodes(swarmhost);
  res.send(nodes);
}

/**
 * [addLabel description]
 * @param {[type]} req [description]
 * @param {[type]} res [description]
 */
async function addLabel(req, res) {
  let {
    swarmhost,
    nodeId,
    label,
    value
  } = req.body;

  let node = await swarm.addLabel({ swarmhost, nodeId, label, value });
  res.send(node);
}

/**
 * [removeLabel description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
async function removeLabel(req, res) {
  let {
    swarmhost,
    nodeId,
    label
  } = req.body;

  console.log('Removing label');
  let node = await swarm.removeLabel({ swarmhost, nodeId, label });
  res.send(node);
}