var debug         = require('debug')('deployer-region-service')
  , Q             = require('q')
  , request       = require('request')
  ;

exports.roleConfigs = function roleConfigs(role, next) {
  role = role.toLowerCase();

  var deferred = Q.defer()
    , result = null
    ;
    
  if(role.indexOf('web') >= 0) {    
    /* jshint es5:false */
    /* jshint ignore:start */
    result = [
      { "key": "Ringtail8|IS_SQLSERVER_SERVER", "value": "" },
      { "key": "Ringtail8|IS_SQLSERVER_USERNAME", "value": "sa" },
      { "key": "Ringtail8|IS_SQLSERVER_PASSWORD", "value": "" },
      { "key": "Ringtail8|IS_SQLSERVER_DATABASE", "value": "" },
      { "key": "Ringtail8|RINGTAILIISWEBAPPLICATIONNAME", "value": "\"Default Web Site/Ringtail\"" },
      { "key": "Ringtail8|RINGTAILWEBAPPNAME", "value": "Ringtail" },
      { "key": "Ringtail8|RINGTAILIISVIRTUALDIRECTORYPHYSICALPATH", "value": "C:\\inetpub\\wwwroot\\Ringtail" },
      { "key": "Ringtail8|RINGTAILIISWEBAPPLICATIONURL", "value": "https://site.ftitools.com/Ringtail" },
      { "key": "Ringtail8|RINGTAILUISTATICCONTENTURL", "value": "https://site.ftitools.com/UIStatic " },
      { "key": "Ringtail8|RINGTAILHELPURL", "value": "https://site.ftitools.com/RingtailHelp " },
      { "key": "Ringtail8|RINGTAILSTSURL", "value": "https://site.ftitools.com/RingtailSTS " },
      { "key": "Ringtail8|RINGTAILSTSCERTIFICATETHUMBPRINT", "value": "\"2c 3f 36 e4 cc b3 24 82 d9 66 11 69 1e e7 2a 5a 2c 0e c4 30\"" },
      { "key": "Ringtail8|SSLUSAGEPROPERTY", "value": "true " },
      { "key": "Ringtail8|RINGTAILSTSCERTIFICATENAME", "value": "RingtailSTS" },
      { "key": "Ringtail8|RINGTAILSTSCERTIFICATEISSUERNAME", "value": "RingtailSTS" },
      { "key": "Ringtail8|RINGTAILSTSIISVIRTUALDIRECTORYPHYSICALPATH", "value": "C:\\inetpub\\wwwroot\\RingtailSTS" },
      { "key": "Ringtail8|RINGTAILUIIISVIRTUALDIRECTORYPHYSICALPATH", "value": "C:\\inetpub\\wwwroot\\RingtailUIStatic" },
      { "key": "Ringtail8|IISAUTHENTICATIONMETHOD", "value": "Forms" },
      { "key": "Ringtail8|SELFSERVICEAUTHENTICATIONMODE", "value": "Ringtail" },
      { "key": "Ringtail8|RINGTAILSTSIISAPPLICATIONNAME", "value": "\"Default Web Site/RingtailSTS\"" },
      { "key": "Ringtail8|RINGTAILUIIISAPPLICATONNAME", "value": "\"Default Web Site/RingtailUIStatic\"" },
      { "key": "Ringtail8|WEBBROWSERPROTOCOL", "value": "https" },
      { "key": "Ringtail8|WEBSERVERSSLUSAGE", "value": "false" },
      { "key": "Ringtail8|RMCIISWEBAPPLICATIONNAME", "value": "\"Default Web Site/RMC\"" },
      { "key": "Ringtail8|RMCAPPNAME", "value": "RMC" },
      { "key": "Ringtail8|RMCIISVIRTUALDIRECTORYPHYSICALPATH", "value": "C:\\inetpub\\wwwroot\\RMC" },
      { "key": "Ringtail8|RMCIISWEBAPPLICATIONURL", "value": "https://site.ftitools.com/RMC" },
      { "key": "Ringtail8|RINGTAILCLASSICURL", "value": "https://site.ftitools.com/classic" },
      { "key": "Ringtail8|RLMIISWEBAPPLICATIONNAME", "value": "\"Default Web Site/RingtailLicenseManagement\"" },
      { "key": "Ringtail8|RLMIISVIRTUALDIRECTORYPHYSICALPATH", "value": "C:\inetpub\wwwroot\RingtailLicenseManagement" },
      { "key": "Ringtail8|RINGTAILCLASSICWEBSITENAME", "value": "\"Default Web Site\"" },
      { "key": "Ringtail8|RINGTAILCLASSICWEBSITEMAPPING", "value": "Legal" }
    ];
    /* jshint ignore:end */    
  } 

  else if (role.indexOf('db') >= 0) {
    /* jshint es5:false */
    /* jshint ignore:start */
    result = [ 
      { "key": "RingtailDatabaseUtility|IS_SQLSERVER_USERNAME", "value": "user" },
      { "key": "RingtailDatabaseUtility|IS_SQLSERVER_PASSWORD", "value": "pwd" },
      { "key": "DatabaseUpgrader|IS_SQLSERVER_USERNAME", "value": "sa" },
      { "key": "DatabaseUpgrader|IS_SQLSERVER_PASSWORD", "value": "pwd" },
      { "key": "DatabaseUpgrader|DATACAMEL_ACTION", "value": "upgrade" },
      { "key": "DatabaseUpgrader|DATACAMEL_DATABASES", "value": "Portal,Rpf,Case01,Case01,rs_tempdb" }
    ]
    /* jshint ignore:end */    
  }

  deferred.resolve(result);
  return deferred.promise.nodeify(next);
};