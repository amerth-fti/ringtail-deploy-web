var debug         = require('debug')('deployer-region-service')
  , Q             = require('q')
  , request       = require('request')
  ;

exports.roleConfigs = function roleConfigs(role, next) {

  var deferred = Q.defer();
  
  /* jshint es5:false */
  /* jshint ignore:start */
  deferred.resolve([
    { "Ringtail8|IS_SQLSERVER_SERVER": "" },
    { "Ringtail8|IS_SQLSERVER_USERNAME": "sa" },
    { "Ringtail8|IS_SQLSERVER_PASSWORD": "" },
    { "Ringtail8|IS_SQLSERVER_DATABASE": "" },
    { "Ringtail8|RINGTAILIISWEBAPPLICATIONNAME": "\"Default Web Site/Ringtail\"" },
    { "Ringtail8|RINGTAILWEBAPPNAME": "Ringtail" },
    { "Ringtail8|RINGTAILIISVIRTUALDIRECTORYPHYSICALPATH": "C:\\inetpub\\wwwroot\\Ringtail" },
    { "Ringtail8|RINGTAILIISWEBAPPLICATIONURL": "https://site.ftitools.com/Ringtail" },
    { "Ringtail8|RINGTAILUISTATICCONTENTURL": "https://site.ftitools.com/UIStatic " },
    { "Ringtail8|RINGTAILHELPURL": "https://site.ftitools.com/RingtailHelp " },
    { "Ringtail8|RINGTAILSTSURL": "https://site.ftitools.com/RingtailSTS " },
    { "Ringtail8|RINGTAILSTSCERTIFICATETHUMBPRINT": "\"2c 3f 36 e4 cc b3 24 82 d9 66 11 69 1e e7 2a 5a 2c 0e c4 30\"" },
    { "Ringtail8|SSLUSAGEPROPERTY": "true " },
    { "Ringtail8|RINGTAILSTSCERTIFICATENAME": "RingtailSTS" },
    { "Ringtail8|RINGTAILSTSCERTIFICATEISSUERNAME": "RingtailSTS" },
    { "Ringtail8|RINGTAILSTSIISVIRTUALDIRECTORYPHYSICALPATH": "C:\\inetpub\\wwwroot\\RingtailSTS" },
    { "Ringtail8|RINGTAILUIIISVIRTUALDIRECTORYPHYSICALPATH": "C:\\inetpub\\wwwroot\\RingtailUIStatic" },
    { "Ringtail8|IISAUTHENTICATIONMETHOD": "Forms" },
    { "Ringtail8|SELFSERVICEAUTHENTICATIONMODE": "Ringtail" },
    { "Ringtail8|RINGTAILSTSIISAPPLICATIONNAME": "\"Default Web Site/RingtailSTS\"" },
    { "Ringtail8|RINGTAILUIIISAPPLICATONNAME": "\"Default Web Site/RingtailUIStatic\"" },
    { "Ringtail8|WEBBROWSERPROTOCOL": "https" },
    { "Ringtail8|WEBSERVERSSLUSAGE": "false" },
    { "Ringtail8|RMCIISWEBAPPLICATIONNAME": "\"Default Web Site/RMC\"" },
    { "Ringtail8|RMCAPPNAME": "RMC" },
    { "Ringtail8|RMCIISVIRTUALDIRECTORYPHYSICALPATH": "C:\\inetpub\\wwwroot\\RMC" },
    { "Ringtail8|RMCIISWEBAPPLICATIONURL": "https://site.ftitools.com/RMC" },
    { "Ringtail8|RINGTAILCLASSICURL": "https://site.ftitools.com/classic" },
    { "Ringtail8|RLMIISWEBAPPLICATIONNAME": "\"Default Web Site/RingtailLicenseManagement\"" },
    { "Ringtail8|RLMIISVIRTUALDIRECTORYPHYSICALPATH": "C:\inetpub\wwwroot\RingtailLicenseManagement" },
    { "Ringtail8|RINGTAILCLASSICWEBSITENAME": "\"Default Web Site\"" },
    { "Ringtail8|RINGTAILCLASSICWEBSITEMAPPING": "Legal" }
  ]);
  /* jshint ignore:end */

  return deferred.promise.nodeify(next);
};