
let nodeClient = require('../mappers/swarm-node-client');

module.exports = {
  getNodes,
  addLabel,
  removeLabel,
};

/**
 * [getNodes description]
 * @param  {[type]} swarmhost [description]
 * @return {[type]}           [description]
 */
async function getNodes(swarmhost) {
  return await nodeClient.getNodes(swarmhost);
}


/**
 * [addLabel description]
 * @param {[type]} args [description]
 */
async function addLabel(args) {
  return await nodeClient.addLabel(args);
}

/**
 * [removeLabel description]
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
async function removeLabel(args) {
  return await nodeClient.removeLabel(args);
}