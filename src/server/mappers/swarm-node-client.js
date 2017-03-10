
const http    = require('http');
const urlUtil = require('url');

module.exports = {
  getNodes,
  addLabel,
  removeLabel,
};

/**
 * Gets the swarm nodes
 * @param  {[type]} swarmhost [description]
 * @return {[type]}           [description]
 */
async function getNodes(swarmhost) {
  return await get(`http://${swarmhost}:4111/api/docker/nodes`);
}

/**
 * [addLabel description]
 * @param {[type]} options.swarmhost [description]
 * @param {[type]} options.nodeId    [description]
 * @param {[type]} options.label     [description]
 * @param {[type]} options.value     [description]
 */
async function addLabel({ swarmhost, nodeId, label, value, sshKey, sshUser }) {
  return await put(`http://${swarmhost}:4111/api/docker/nodes/${nodeId}/labels/${label}`, { json: { label, value, sshKey, sshUser }});
}

/**
 * [removeLabel description]
 * @param  {[type]} options.swarmhost [description]
 * @param  {[type]} options.nodeId    [description]
 * @param  {[type]} options.label     [description]
 * @param  {[type]} options.value     [description]
 * @return {[type]}                   [description]
 */
async function removeLabel({ swarmhost, nodeId, label }) {
  return await del(`http://${swarmhost}:4111/api/docker/nodes/${nodeId}/labels/${label}`);
}


//////////////////


function get(url) {
  return new Promise((resolve, reject) => {
    let { hostname, port, path } = urlUtil.parse(url);
    let opts = {
      hostname,
      port,
      path,
      method: 'GET'
    };
    let req = http.request(opts, (res) => {
      let buffers = [];
      res.on('error', reject);
      res.on('data', (buffer) => buffers.push(buffer));
      res.on('end', () => res.statusCode === 200
        ? resolve(JSON.parse(Buffer.concat(buffers)))
        : reject(Buffer.concat(buffers).toString()));
    });
    req.on('error', reject);
    req.end();
  });
}


function post(url, { json }) {
  return new Promise((resolve, reject) => {
    let { hostname, port, path } = urlUtil.parse(url);
    let data = JSON.stringify(json);
    let opts = {
      hostname,
      port,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    let req = http.request(opts, (res) => {
      let buffers = [];
      res.on('error', reject);
      res.on('data', (buffer) => buffers.push(buffer));
      res.on('end', () => res.statusCode === 200
        ? resolve(JSON.parse(Buffer.concat(buffers)))
        : reject(Buffer.concat(buffers).toString()));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function put(url, { json }) {
  return new Promise((resolve, reject) => {
    let { hostname, port, path } = urlUtil.parse(url);
    let data = JSON.stringify(json);
    let opts = {
      hostname,
      port,
      path,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    let req = http.request(opts, (res) => {
      let buffers = [];
      res.on('error', reject);
      res.on('data', (buffer) => buffers.push(buffer));
      res.on('end', () => res.statusCode === 200
        ? resolve(JSON.parse(Buffer.concat(buffers)))
        : reject(Buffer.concat(buffers).toString()));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function del(url) {
  return new Promise((resolve, reject) => {
    let { hostname, port, path } = urlUtil.parse(url);
    let opts = {
      hostname,
      port,
      path,
      method: 'DELETE',
    };
    let req = http.request(opts, (res) => {
      let buffers = [];
      res.on('error', reject);
      res.on('data', (buffer) => buffers.push(buffer));
      res.on('end', () => res.statusCode === 200
        ? resolve(JSON.parse(Buffer.concat(buffers)))
        : reject(Buffer.concat(buffers).toString()));
    });
    req.on('error', reject);
    req.end();
  });
}