
let swarm = require('../services/swarm-service');

module.exports = {
  info,
  nodes,
  deployments,
  deployStack,
  deployService,
  addLabel,
  removeLabel,
  serviceLogs,
  getManagerVersions,
  updateManager,
};

/**
 * [config description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
async function info(req, res) {
  let {swarmhost} = req.query;
  if(!swarmhost) {
    return res.status(404).send('swarmhost is required');
  }

  let info = await swarm.getInfo(swarmhost);
  res.send(info);
}

/**
 * [list description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
async function nodes(req, res) {
  let {swarmhost} = req.query;
  if(!swarmhost ) {
    res.send([]);
    return;
  }

  let nodes = await swarm.getNodes(swarmhost);
  res.send(nodes);
}


/**
 * [deployments description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
async function deployments(req, res) {
  let {swarmhost} = req.query;
  if(!swarmhost) {
    res.send({ services: [], tasks: [] });
    return;
  }

  let deployments = await swarm.getDeployments(swarmhost);
  res.send(deployments);
}


/**
 * [description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
async function deployStack(req, res, next) {
  let {
    swarmhost,
    stack,
    accessKeyId,
    secretAccessKey,
    dockerHub,
  } = req.body;

  if(!swarmhost) {
    return res.status(400).send('swarmhost is required');
  }

  if(!stack) {
    return res.status(400).send('stack is required');
  }

  await swarm.deployStack({ swarmhost, accessKeyId, secretAccessKey, stack, dockerHub });
  res.send({ ok: true });
};

/**
 * [deployService description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
async function deployService(req, res, next) {
  let {
    swarmhost,
    accessKeyId,
    secretAccessKey,
    service,
  } = req.body;

  if(!swarmhost) {
    return res.status(400).send('swarmhost is required');
  }

  if(!service) {
    return res.status(400).send('servie is required');
  }

  await swarm.deployService({ swarmhost, accessKeyId, secretAccessKey, service });
  res.send({ ok: true });
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
    value,
    sshKey,
    sshUser,
  } = req.body;

  let node = await swarm.addLabel({ swarmhost, nodeId, label, value, sshKey, sshUser });
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

/**
 * [serviceLogs description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
async function serviceLogs(req, res) {
  let {
    swarmhost,
    service
  } = req.query;

  console.log('Getting logs for ', service);
  let logs = await swarm.serviceLogs({ swarmhost, service });
  res.send(logs);
}


/**
 * [getManagerVersions description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
async function getManagerVersions(req, res) {
  let {
    swarmhost,
    accessKeyId,
    secretAccessKey,
  } = req.query;

  console.log('Loading service versions');
  let results = await swarm.getManagerVersions({ swarmhost, accessKeyId, secretAccessKey });
  res.send(results);
}

/**
 * [updateManager description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
async function updateManager(req, res) {
  let {
    version,
    swarmhost,
    accessKeyId,
    secretAccessKey,
  } = req.body;

  console.log('Updating manager service to ' + version);
  await swarm.updateManager({ swarmhost, accessKeyId, secretAccessKey, version });
  res.send({ ok: true });
}