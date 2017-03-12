
let nodeClient = require('../mappers/swarm-node-client');

module.exports = {
  getNodes,
  addLabel,
  removeLabel,
  deploy,
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

/**
 * [deploy description]
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
async function deploy(args) {
  await nodeClient.deployInfrastructure(args);
  await nodeClient.deployServices(args);
}