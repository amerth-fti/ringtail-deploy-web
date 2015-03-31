var HttpBrowser = require('./browsers/http-browser');

exports.fromRegion = function(region) {
  var config = region.browseConfig
    , result = null
    ;

  if(config.type === 'http') {
    result = new HttpBrowser(config);
  } 
  // TODO
  // else if(config.type === 'ftp') {
    
  // }
  // TODO
  // else if (config.type === 'smb') {
    
  // }

  return result;  
};