
let nodeClient = require('../mappers/swarm-node-client');

module.exports = {
  getNodes,
  getDeployments,
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
 * [getDeployments description]
 * @param  {[type]} swarmhost [description]
 * @return {[type]}           [description]
 */
async function getDeployments(swarmhost) {
  return await nodeClient.getDeployments(swarmhost);
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
async function deploy(swarmhost) {
  await nodeClient.deployInfrastructure(swarmhost);
  await nodeClient.deployServices(swarmhost);
}