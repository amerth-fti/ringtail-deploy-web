
const http    = require('http');
const urlUtil = require('url');

module.exports = {
  getNodes,
};

/**
 * Gets the swarm nodes
 * @param  {[type]} swarmhost [description]
 * @return {[type]}           [description]
 */
async function getNodes(swarmhost) {
  return await get(`http://${swarmhost}:4111/api/docker/nodes`);
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
        : reject(Buffer.concat(buffers)));
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
        : reject(Buffer.concat(buffers)));
    });
    req.on('error', reject);
    req.send();
    req.end();
  });
}