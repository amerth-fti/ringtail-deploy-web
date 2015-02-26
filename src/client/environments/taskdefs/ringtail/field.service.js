(function() {
  
  var fieldMappings
    , fields
    ;  

  angular
    .module('app.environments.taskdefs.ringtail')
    .service('RingtailField', ringtailField);

  ringtailField.$inject = [ '_' ];

  function ringtailField(_) {
    return {
      getField: getField
    };

    function getField(config) {
      var fieldKey = fieldMappings[config]
        , field;

      // find the field
      if(fieldKey) {
        field = _.clone(fields[fieldKey]);                
      }

      // couldn't find field
      // return unknown field info
      if(!field) {
        fieldKey = 'UNKNOWN';
        field = _.clone(fields[fieldKey]);
        field.title = config;
      }
      
      // store the field key    
      field.fieldKey = fieldKey;          
      return field;
    }
  }


  /* jshint es5:false */
  /* jshint ignore:start */
  fieldMappings = {
    "RingtailDatabaseUtility|IS_SQLSERVER_SERVER": "IS_SQLSERVER_SERVER_PORTAL",
    "RingtailDatabaseUtility|IS_SQLSERVER_USERNAME": "IS_SQLSERVER_USERNAME",
    "RingtailDatabaseUtility|IS_SQLSERVER_PASSWORD": "IS_SQLSERVER_PASSWORD",
    "RingtailDatabaseUtility|WEBUSER": "WEBUSER",

    "RingtailLegalApplicationServer|IS_SQLSERVER_SERVER": "IS_SQLSERVER_SERVER_PORTAL",
    "RingtailLegalApplicationServer|IS_SQLSERVER_USERNAME": "IS_SQLSERVER_USERNAME",
    "RingtailLegalApplicationServer|IS_SQLSERVER_PASSWORD": "IS_SQLSERVER_PASSWORD",
    "RingtailLegalApplicationServer|IS_SQLSERVER_DATABASE": "IS_SQLSERVER_DATABASE_PORTAL",
    "RingtailLegalApplicationServer|RINGTAILSTSURL": "RINGTAILSTSURL",
    "RingtailLegalApplicationServer|RMCIISWEBAPPLICATIONURL": "RMCIISWEBAPPLICATIONURL",
    "RingtailLegalApplicationServer|RINGTAILLEGALURL": "RINGTAILLEGALURL",
    "RingtailLegalApplicationServer|LEGALPATH": "LEGALPATH",
    "RingtailLegalApplicationServer|RINGTAILSTSCERTIFICATETHUMBPRINT": "RINGTAILSTSCERTIFICATETHUMBPRINT",
    "RingtailLegalApplicationServer|RINGTAILSTSCERTIFICATENAME": "RINGTAILSTSCERTIFICATENAME",
    "RingtailLegalApplicationServer|WEBSERSSLUSAGE": "WEBSERSSLUSAGE",
    "RingtailLegalApplicationServer|WEBBROWSERPROTOCOL": "WEBBROWSERPROTOCOL",

    "Ringtail8|IS_SQLSERVER_SERVER": "IS_SQLSERVER_SERVER_PORTAL",
    "Ringtail8|IS_SQLSERVER_USERNAME": "IS_SQLSERVER_USERNAME",
    "Ringtail8|IS_SQLSERVER_PASSWORD": "IS_SQLSERVER_PASSWORD",
    "Ringtail8|IS_SQLSERVER_DATABASE": "IS_SQLSERVER_DATABASE_PORTAL",
    "Ringtail8|RINGTAILWEBAPPNAME": "RINGTAILWEBAPPNAME",    
    "Ringtail8|RINGTAILIISWEBAPPLICATIONNAME": "RINGTAILIISWEBAPPLICATIONNAME",  
    "Ringtail8|RINGTAILIISVIRTUALDIRECTORYPHYSICALPATH": "RINGTAILIISVIRTUALDIRECTORYPHYSICALPATH",
    "Ringtail8|RINGTAILSTSIISAPPLICATIONNAME": "RINGTAILSTSIISAPPLICATIONNAME",  
    "Ringtail8|RINGTAILSTSIISVIRTUALDIRECTORYPHYSICALPATH": "RINGTAILSTSIISVIRTUALDIRECTORYPHYSICALPATH",
    "Ringtail8|RINGTAILUIIISAPPLICATONNAME": "RINGTAILUIIISAPPLICATONNAME",
    "Ringtail8|RINGTAILUIIISVIRTUALDIRECTORYPHYSICALPATH": "RINGTAILUIIISVIRTUALDIRECTORYPHYSICALPATH",
    "Ringtail8|RLMIISWEBAPPLICATIONNAME": "RLMIISWEBAPPLICATIONNAME",
    "Ringtail8|RLMIISVIRTUALDIRECTORYPHYSICALPATH": "RLMIISVIRTUALDIRECTORYPHYSICALPATH",
    "Ringtail8|RMCIISWEBAPPLICATIONNAME": "RMCIISWEBAPPLICATIONNAME",
    "Ringtail8|RMCAPPNAME": "RMCAPPNAME",
    "Ringtail8|RMCIISVIRTUALDIRECTORYPHYSICALPATH": "RMCIISVIRTUALDIRECTORYPHYSICALPATH",
    "Ringtail8|SSLUSAGEPROPERTY": "WEBSERSSLUSAGE",  
    "Ringtail8|WEBSERVERSSLUSAGE": "WEBSERSSLUSAGE",
    "Ringtail8|RINGTAILIISWEBAPPLICATIONURL": "RINGTAILIISWEBAPPLICATIONURL",  
    "Ringtail8|RINGTAILUISTATICCONTENTURL": "RINGTAILUISTATICCONTENTURL",
    "Ringtail8|RINGTAILCLASSICURL": "RINGTAILCLASSICURL",
    "Ringtail8|RINGTAILSTSURL": "RINGTAILSTSURL",
    "Ringtail8|RINGTAILHELPURL": "RINGTAILHELPURL",
    "Ringtail8|RMCIISWEBAPPLICATIONURL": "RMCIISWEBAPPLICATIONURL",
    "Ringtail8|RINGTAILSTSCERTIFICATETHUMBPRINT": "RINGTAILSTSCERTIFICATETHUMBPRINT",
    "Ringtail8|WEBBROWSERPROTOCOL": "WEBBROWSERPROTOCOL",
    "Ringtail8|IISAUTHENTICATIONMETHOD": "IISAUTHENTICATIONMETHOD",
    "Ringtail8|RINGTAILSTSCERTIFICATEISSUERNAME": "RINGTAILSTSCERTIFICATEISSUERNAME",
    "Ringtail8|RINGTAILCLASSICWEBSITENAME": "RINGTAILCLASSICWEBSITENAME",
    "Ringtail8|RINGTAILCLASSICWEBSITEMAPPING": "RINGTAILCLASSICWEBSITEMAPPING",
    "Ringtail8|RINGTAILSTSCERTIFICATENAME": "RINGTAILSTSCERTIFICATENAME",    
    "Ringtail8|SELFSERVICEAUTHENTICATIONMODE": "SELFSERVICEAUTHENTICATIONMODE"    
  }


  fields = {
    "UNKNOWN": {
      "title": "Unknown field",
      "description": "Unknown field"
    },
    "IS_SQLSERVER_SERVER_PORTAL": {
      "title": "Server name",
      "description": "The instance name of the SQL server that contains the Ringtail Portal database.",      
    },
    "IS_SQLSERVER_SERVER_RPF": {
      "title": "Server name",
      "description": "The instance name of the SQL server that contains the Ringtail Processing Framework database."
    },
    "IS_SQLSERVER_USERNAME": {
      "title": "Login",
      "description": "The SQL Server username used to connect to the SQL server.",
      "default": "sa"
    },
    "IS_SQLSERVER_PASSWORD": {
      "title": "Password",
      "description": "The SQL Server password used to connect to the SQL server."  
    },
    "IS_SQLSERVER_DATABASE_PORTAL": {
      "title": "Portal Database",
      "description": "The Portal database name"
    },
    "IS_SQLSERVER_DATABASE_RPF": {
      "title": "RPF Database",
      "description": "The RPF database name"
    },
    "WEBUSER": {    
      "title": "Ringtail database user",
      "description": "The Ringtail database user",
      "default": "webuser"    
    },
    "RINGTAILSTSURL": {    
      "title": "Ringtail Security Token Service URL",
      "description": "The URL of the Ringtail STS Application. (e.g.: http://host/RingtailSTS)"
    },  
    "RMCIISWEBAPPLICATIONURL": {
      "title": "Ringtail Management Console URL",
      "description": "The URL of the Ringtail Management Console Application. (e.g. http://host/RMC)"
    },
    "RINGTAILLEGALURL": {
      "title": "Ringtail Legal (Classic) Application URL",
      "description": "The URL of the Ringtail Legal (Classic) Application. (e.g. http://host/classic)"
    },
    "LEGALPATH": {
      "title": "Ringtail Legal Application Name",
      "description": "The Ringtail Legal Application name e.g. RTLC",
    },
    "RINGTAILSTSCERTIFICATETHUMBPRINT": {
      "title": "",
      "description": "The thumbprint of the installed Ringtail Secure Token Service (STS) certificate.",
      "default": "2c 3f 36 e4 cc b3 24 82 d9 66 11 69 1e e7 2a 5a 2c 0e c4 30"
    },
    "RINGTAILSTSCERTIFICATENAME": {
      "title": "Certificate Name",
      "description": "The name of the certificate used by the Ringtail Secure Token Service (STS) to sign tokens with.",
      "default": "RingtailSTS"
    },
    "WEBSERSSLUSAGE": {
      "title": "Web Server SSL Usage",
      "description": "The Web Server (IIS) is configured to use SSL: true, false (select 'false' if SSL is handled by the Load Balancer).",
      "default": "false",
      "options": ["false", "true"]
    },
    "WEBBROWSERPROTOCOL": {
      "title": "Client Web Browser Protocol",
      "description": "Specify the protocol used by the client web browser when accessing Ringtail; select either http or https.",
      "default": "http",
      "options": ["http", "https"]
    },
    "RINGTAILIISWEBAPPLICATIONNAME": {
      "title": "Ringtail Web Application Name",
      "description": "The full site path where you want to install the Ringtail Web Application. (e.g. Default Web Site/Ringtail)",
      "default": "Default Web Site/Ringtail"
    },
    "RINGTAILWEBAPPNAME": {
      "title": "Ringtail Web Application Name",
      "description": "The Ringtail Web Application name (e.g. Ringtail)",
      "default": "Ringtail"
    },
    "RINGTAILIISVIRTUALDIRECTORYPHYSICALPATH": {
      "title": "Ringtail Web Application Physical Path",
      "description": "The physical path where the files for the Web application will be deployed.",
      "default": "C:\\inetpub\\wwwroot\\Ringtail\\"
    },  
    "RINGTAILSTSIISAPPLICATIONNAME": {
      "title": "Ringtail STS Application Name",
      "description": "The full site path where you want to install the Ringtail STS Application (e.g. Default Web Site/RingtailSTS",
      "default": "Default Web Site/RingtailSTS"
    },
    "RINGTAILSTSIISVIRTUALDIRECTORYPHYSICALPATH": {
      "title": "Ringtail STS Physical Path",
      "description": "The physical path where the files for the Ringtail STS application will be deployed.",
      "default": "C:\\inetpub\\wwwroot\\RingtailSTS\\"
    },
    "RINGTAILUIIISAPPLICATONNAME": {
      "title": "Ringtail UI Static Application Name",
      "description": "The full site path where you want to install the Ringtail UI Static Application (e.g. Default Web Site/UIStatic).",
      "default": "Default Web Site/UIStatic"
    },
    "RINGTAILUIIISVIRTUALDIRECTORYPHYSICALPATH": {
      "title": "Ringtail UI Static Content Physical Path",
      "description": "The physical path where the files for the Ringtail UI Static Application will be deployed.",
      "default": "C:\\inetpub\\wwwroot\\UIStatic\\"    
    },
    "RLMIISWEBAPPLICATIONNAME": {
      "title": "Ringtail License Management Application Name",
      "description": "The full site path where you want to install Ringtail License Management (e.g. Default Web Site/RingtailLicenseManagment).",
      "default": "Default Web Site/RingtailLicenseManagement"
    },
    "RLMIISVIRTUALDIRECTORYPHYSICALPATH": {
      "title": "Ringtail License Management Physical Path",
      "description": "The physical path where files for Ringtail License Management will be deployed.",
      "default": "C:\\inetpub\\wwwroot\\RingtailLicenseManagement\\"
    },
    "RMCIISWEBAPPLICATIONNAME": {
      "title": "Ringtail Management Console Application Name",
      "description": "The full site path where you want to install Ringtail Management Console (e.g. Default Web Site/RMC).",
      "default": "Default Web Site/RMC"
    },
    "RMCAPPNAME": {
      "title": "Ringtail Management Console Application Name",
      "description": "The Ringtail Management Console Application name (e.g. RMC)",
      "default": "RMC"
    },
    "RMCIISVIRTUALDIRECTORYPHYSICALPATH": {
      "title": "Ringtail Management Console Physical Path",
      "description": "The physical path where files for Ringtail Management Console will be deployed.",
      "default": "C:\\inetpub\\wwwroot\\RMC\\"
    },
    "RINGTAILIISWEBAPPLICATIONURL": {
      "title": "Ringtail Web Application URL",
      "description": "The Ringtail Web Application URL (e.g. http://host/Ringtail)"
    },
    "RINGTAILUISTATICCONTENTURL": {
      "title": "Ringtail UI Static Content URL",
      "description": "The Ringtail UI Static Content URL (e.g. http://host/UIStatic)"
    },
    "RINGTAILCLASSICURL": {
      "title": "Ringtail Legal Application URL",
      "description": "The Ringtail Legal (Classic) Application URL (e.g. http://host/classic)"
    },  
    "RINGTAILHELPURL": {
      "title": "Ringtail Help URL",
      "description": "The Ringtail Help URL (e.g. http://host/RingtailHelp)"
    },
    "IISAUTHENTICATIONMETHOD": {
      "title": "IIS Authentication Method",
      "description": "Select 'Forms' for users to connect to Ringtail using Ringtail Authentication, or select 'Windows' to use Windows Authentication.",
      "default": "Forms",
      "options": ["Forms", "Windows"]
    },
    "RINGTAILSTSCERTIFICATEISSUERNAME": {
      "title": "Certificate Issuer Name",
      "description": "The 'Issued By' name for the Ringtail Secure Token Service (STS) to sign tokens with.",
      "default": "RingtailSTS"
    },
    "RINGTAILCLASSICWEBSITENAME": {
      "title": "Ringtail Legal (Classic) Web Site Name",
      "description": "The web site name where the Ringtail Legal (Classic) mapping is located. (e.g. Default Web Site)",
      "default": "Default Web Site"
    },
    "RINGTAILCLASSICWEBSITEMAPPING": {
      "title": "Ringtail Legal Web Site Mapping",
      "description": "The web site mapping that is used for Ringtail Legal (Classic) (e.g. Legal)",
      "default": "Legal"
    },
    "SELFSERVICEAUTHENTICATIONMODE": {
      "title": "Self Service Authentication Mode",
      "description": "Self-service Authentication Mode that will be used",
      "default": "Ringtail",
      "options": ["Ringtail", "ADSelfService"]
    }
  }
  /* jshint ignore:end */  
}());