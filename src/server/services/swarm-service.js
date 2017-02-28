
let nodeClient = require('../mappers/swarm-node-client');

module.exports = {
  getNodes,
};

/**
 * [getNodes description]
 * @param  {[type]} swarmhost [description]
 * @return {[type]}           [description]
 */
async function getNodes(swarmhost) {
  return await nodeClient.getNodes(swarmhost);
}

