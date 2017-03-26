
let swarmClient = require('../mappers/swarm-client');

module.exports = {
  getNodes,
  getDeployments,
  addLabel,
  removeLabel,
  deploy,
  deployService,
};

/**
 * [getNodes description]
 * @param  {[type]} swarmhost [description]
 * @return {[type]}           [description]
 */
async function getNodes(swarmhost) {
  return await swarmClient.getNodes(swarmhost);
}

/**
 * [getDeployments description]
 * @param  {[type]} swarmhost [description]
 * @return {[type]}           [description]
 */
async function getDeployments(swarmhost) {
  return await swarmClient.getDeployments(swarmhost);
}


/**
 * [addLabel description]
 * @param {[type]} args [description]
 */
async function addLabel(args) {
  return await swarmClient.addLabel(args);
}

/**
 * [removeLabel description]
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
async function removeLabel(args) {
  return await swarmClient.removeLabel(args);
}

/**
 * [deploy description]
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
async function deploy({ swarmhost, accessKeyId, secretAccessKey }) {
  await swarmClient.deployCore({ swarmhost, accessKeyId, secretAccessKey });
  await swarmClient.deployServices({ swarmhost, accessKeyId, secretAccessKey });
}

/**
 * [deployService description]
 * @param  {[type]} options.swarmhost       [description]
 * @param  {[type]} options.accessKeyId     [description]
 * @param  {[type]} options.secretAccessKey [description]
 * @param  {[type]} options.service         [description]
 * @return {[type]}                         [description]
 */
async function deployService({ swarmhost, accessKeyId, secretAccessKey, service }) {
  await swarmClient.deployService({ swarmhost, accessKeyId, secretAccessKey, service });
}