
let swarm = require('../services/swarm-service');

module.exports = {
  list,
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