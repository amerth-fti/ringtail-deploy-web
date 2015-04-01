var fs    = require('fs')
  , path  = require('path')
  , _     = require('underscore')
  , Q     = require('q')
  ;

/**
 * Browser that returns folders in a UNC share path
 */
function SmbBrowser(config) {
  _.extend(this, config);
}

module.exports = SmbBrowser;


/**
 * Retrieves the list of branches as an array of strings
 *
 * @param {function} [next] - node callback
 * @return {promise}
 */
SmbBrowser.prototype.branches = function branches(next) {
  return SmbBrowser.listDirs(this.smbPath).nodeify(next);
};


/**
 * Retrieves the list of builds for a branch as a list of strings
 *
 * @param {string} branch - the branch to retrieve builds for
 * @param {function} [next] - node callback
 * @return {promise}
 */
SmbBrowser.prototype.builds = function builds(branch, next) {
  var branchPath = this.smbPath + '\\' + branch;
  return SmbBrowser.listDirs(branchPath).nodeify(next);
};


/**
 * Lists the directories in the path provided
 * 
 * @param {string} dir - the root path to check
 * @param {function} [next] - node callback
 * @return {promise} resolves to an array of directory names
 */
SmbBrowser.listDirs = function listDirs(dir, next) {  
  return Q
    .nfcall(fs.readdir, dir)    
    .then(function(files) {        
      return Q.all(files.map(function(file) {
        var fullPath = path.join(dir, file);        
        return Q.nfcall(fs.stat, fullPath).then(function(stat) {
          return stat.isDirectory() ? file : null;
        });
      }));
    })
    .then(function(dirs) {
      return dirs.filter(function(dir) { 
        return !!dir;
      });
    })
    .nodeify(next);
};