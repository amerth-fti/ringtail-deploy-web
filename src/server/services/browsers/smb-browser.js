var fs    = require('fs')
  , debug = require('debug')('deployer-browsers-smb-browser')
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
  var branchPath = path.join(this.smbPath, branch);
  return SmbBrowser.listDirs(branchPath).nodeify(next);
};

/**
 * Retrieves the list of builds for a branch as a list of strings
 *
 * @param {string} branch - the branch to retrieve builds for
 * @param {function} [next] - node callback
 * @return {promise}
 */
SmbBrowser.prototype.files = function files(branch, next) {
  var branchPath = path.join(this.smbPath, branch);
  return SmbBrowser.listFiles(branchPath).nodeify(next);
};

/**
 * Retrieves the list of builds for a branch as a list of strings
 *
 * @param {string} branch - the branch to retrieve builds for
 * @param {function} [next] - node callback
 * @return {promise}
 */
SmbBrowser.prototype.readContents = function readContents(branch, next) {
  var branchPath = path.join(this.smbPath, branch);
  return SmbBrowser.readContents(branchPath).nodeify(next);
};

/**
 * Retrieves the list of builds for a branch as a list of strings
 *
 * @param {string} branch - the branch to retrieve builds for
 * @param {function} [next] - node callback
 * @return {promise}
 */
SmbBrowser.prototype.compare = function compare(branch, next) {
  var branchPath = path.join(this.smbPath, branch);
  return SmbBrowser.getNameSizeMap(branchPath).nodeify(next);
};

/**
 * Retrieves the list of builds for a branch as a list of strings
 *
 * @param {string} branch - the branch to retrieve builds for
 * @param {function} [next] - node callback
 * @return {promise}
 */
SmbBrowser.prototype.reconcileManifestWithDisk = function reconcileManifestWithDisk(branch, next) {
  var branchPath = path.join(this.smbPath, branch),
    manifest,
    onDisk;

  return Q.fcall(SmbBrowser.getNameSizeMap, branchPath)
    .then(function(result) {
      onDisk = result;
      return SmbBrowser.readContents(branchPath + '/manifest.txt');
    })
    .then(function(result) {
      manifest = result;
      return SmbBrowser.compareManifestToMap(manifest, onDisk);
    })
    .nodeify(next);
};

/**
 * Lists the directories in the path provided
 * 
 * @param {string} dir - the root path to check
 * @param {function} [next] - node callback
 * @return {promise} resolves to an array of directory names
 */
SmbBrowser.listDirs = function listDirs(dir, next) {  
  var foldersOnly = function(stat, file) {
    return stat.isDirectory() ? file : null;
  },
    cfg = {
      dir: dir,
      filterFn: foldersOnly
    };

  return this.filteredListContents(cfg, next);
};

/**
 * Lists the files in the path provided
 * 
 * @param {string} dir - the root path to check
 * @param {function} [next] - node callback
 * @return {promise} resolves to an array of directory names
 */
SmbBrowser.listFiles = function listFiles(dir, next) {
  console.log("LISTFILES");
  var foldersOnly = function(stat, file) {
    return stat.isDirectory() ? null : file;
  },
    cfg = {
      dir: dir,
      filterFn: foldersOnly
    };

  return this.filteredListContents(cfg, next);
};

/**
 * Lists the contents of a file
 * 
 * @param {string} dir - the root path to check
 * @param {function} [next] - node callback
 * @return {promise} resolves to an array of directory names
 */
SmbBrowser.readContents = function readContents(file, next) {
  console.log("READCONTENTS");
  var me = this;
  return Q
    .nfcall(fs.readFile, file, 'utf8', next)
    .then(function(contents) {
      var x =  me.readManifestFile(contents);
      return x;
    })
    .nodeify(next);
};

SmbBrowser.readManifestFile = function readManifestFile(contents) {
  console.log("READ");
  
  return _.map(contents.split('\n'), function(row) {
    var cleaned = row.replace(/['"]+/g, '').replace(/['\r']+/g, ''),
      splitEntry = cleaned.split(':');

    var version = splitEntry[2] || "99.99.99.99"

    var obj = { name: splitEntry[0], size: splitEntry[1], version: version};
    return obj;
  });
};

SmbBrowser.compareManifestToMap = function compareManifestToMap(manifestContents, onDiskMap) {
  console.log("COMPARE");
  return _.map(manifestContents, function(item) {
    var match = _.filter(onDiskMap, function (fileInfo) {
      return fileInfo.name === item.name;
    }),
      fileSizeOk = match.length === 1 ? item.size == match[0].size : false;
    return {name: item.name, exists: match.length === 1, sizeOk: fileSizeOk};
  });
};

SmbBrowser.getNameSizeMap = function getNameSizeMap(dir, next) {
  var dir = dir;

  return Q
    .nfcall(fs.readdir, dir)
    .then(function(files) {
      return Q.all(files.map(function(file) {
        var fullPath = path.join(dir, file);
        return Q.nfcall(fs.stat, fullPath).then(function(stat) {
          return {name: file, size: stat.size};
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

SmbBrowser.filteredListContents = function filteredListContents(cfg, next) {
  console.log("FILTER");
  var dir = cfg.dir,
    filterFn = cfg.filterFn;

  return Q
    .nfcall(fs.readdir, dir)
    .then(function(files) {
      return Q.all(files.map(function(file) {
        console.log("FILE", file);
        
        var fullPath = path.join(dir, file);
        return Q.nfcall(fs.stat, fullPath).then(function(stat) {
          console.log("STAT", stat);
          var x = filterFn(stat, file);
          return x;
        });
      }));
    })
    .then(function(dirs) {
      console.log("DIRS", dirs)
      return dirs.filter(function(dir) { 
        return !!dir;
      });
    })
    .nodeify(next);
};

