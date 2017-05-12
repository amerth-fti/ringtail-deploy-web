
let swarmClient = require('../mappers/swarm-client');

module.exports = {
  getInfo,
  getNodes,
  getDeployments,
  addLabel,
  removeLabel,
  deployStack,
  deployService,
  serviceLogs,
  getManagerVersions,
  updateManager,
};

/**
 * [getInfo description]
 * @param  {[type]} swarmhost [description]
 * @return {[type]}           [description]
 */
async function getInfo(swarmhost) {
  return await swarmClient.getInfo(swarmhost);
}

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
async function deployStack({ swarmhost, accessKeyId, secretAccessKey, stack, dockerHub }) {
  await swarmClient.deployStack({ swarmhost, accessKeyId, secretAccessKey, stack, dockerHub });
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

/**
 * [serviceLogs description]
 * @param  {[type]} options.swarmhost [description]
 * @param  {[type]} options.service   [description]
 * @return {[type]}                   [description]
 */
async function serviceLogs({ swarmhost, service }) {
  return await swarmClient.serviceLogs({ swarmhost, service });
}

/**
 * [getManagerVersions description]
 * @param  {[type]} options.swarmhost       [description]
 * @param  {[type]} options.accessKeyId     [description]
 * @param  {[type]} options.secretAccessKey [description]
 * @return {[type]}                         [description]
 */
async function getManagerVersions({ swarmhost, accessKeyId, secretAccessKey }) {
  return await swarmClient.getManagerVersions({ swarmhost, accessKeyId, secretAccessKey });
}

/**
 * [updateManager description]
 * @param  {[type]} options.swarmhost       [description]
 * @param  {[type]} options.accessKeyId     [description]
 * @param  {[type]} options.secretAccessKey [description]
 * @param  {[type]} options.version         [description]
 * @return {[type]}                         [description]
 */
async function updateManager({ swarmhost, accessKeyId, secretAccessKey, version }) {
  return await swarmClient.updateManager({ swarmhost, accessKeyId, secretAccessKey, version });
}