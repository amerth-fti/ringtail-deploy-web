(function() {

  var fieldMappings
    , fields
    ;

  angular
    .module('app.environments.config')
    .service('RingtailField', ringtailField);

  ringtailField.$inject = [ '_' ];

  function ringtailField(_) {
    var fieldLookup = _.indexBy(fields, 'key');

    return {
      getFieldForConfigKey: getFieldForConfigKey
    };

    function getFieldForConfigKey(configKey) {
      var fieldKey = fieldMappings[configKey]
        , field;

      // find the field
      if(fieldKey) {
        field = _.clone(fieldLookup[fieldKey]);
      }

      // couldn't find field, use unknown
      if(!field) {
        fieldKey = 'UNKNOWN';
        field = _.clone(fieldLookup[fieldKey]);
        field.title = configKey;
      }

      // set whether field is valid
      field.validate = function() {
        if(field.ignoreValidation) {
          field.valid = true;
        } else { 
          field.valid = !!field.value;
        }
      };
      field.validate();

      return field;
    }


  }


  /* eslint-disable */
  fieldMappings = {
    "RingtailDatabaseUtility|IS_SQLSERVER_SERVER": "IS_SQLSERVER_SERVER_PORTAL",
    "RingtailDatabaseUtility|IS_SQLSERVER_USERNAME": "IS_SQLSERVER_USERNAME_PORTAL",
    "RingtailDatabaseUtility|IS_SQLSERVER_PASSWORD": "IS_SQLSERVER_PASSWORD_PORTAL",
    "RingtailDatabaseUtility|IS_SQLSERVER_DATABASE": "IS_SQLSERVER_DATABASE_PORTAL",
    "RingtailDatabaseUtility|WEBUSER": "WEBUSER",
    "DatabaseUpgrader|IS_SQLSERVER_SERVER": "IS_SQLSERVER_SERVER_PORTAL",
    "DatabaseUpgrader|IS_SQLSERVER_USERNAME": "IS_SQLSERVER_USERNAME_PORTAL",
    "DatabaseUpgrader|IS_SQLSERVER_PASSWORD": "IS_SQLSERVER_PASSWORD_PORTAL",
    "DatabaseUpgrader|DATACAMEL_ACTION": "DATACAMEL_ACTION",
    "DatabaseUpgrader|DATACAMEL_DATABASES": "DATACAMEL_DATABASES",

    "RingtailLegalApplicationServer|IS_SQLSERVER_SERVER": "IS_SQLSERVER_SERVER_PORTAL",
    "RingtailLegalApplicationServer|IS_SQLSERVER_USERNAME": "IS_SQLSERVER_USERNAME_PORTAL",
    "RingtailLegalApplicationServer|IS_SQLSERVER_PASSWORD": "IS_SQLSERVER_PASSWORD_PORTAL",
    "RingtailLegalApplicationServer|IS_SQLSERVER_DATABASE": "IS_SQLSERVER_DATABASE_PORTAL",
    "RingtailLegalApplicationServer|RINGTAILSTSURL": "RINGTAILSTSURL",
    "RingtailLegalApplicationServer|RMCIISWEBAPPLICATIONURL": "RMCIISWEBAPPLICATIONURL",
    "RingtailLegalApplicationServer|RINGTAILLEGALURL": "RINGTAILCLASSICURL",
    "RingtailLegalApplicationServer|RINGTAILURL": "RINGTAILIISWEBAPPLICATIONURL",
    "RingtailLegalApplicationServer|LEGALPATH": "LEGALPATH",
    "RingtailLegalApplicationServer|RINGTAILSTSCERTIFICATETHUMBPRINT": "RINGTAILSTSCERTIFICATETHUMBPRINT",
    "RingtailLegalApplicationServer|RINGTAILSTSCERTIFICATENAME": "RINGTAILSTSCERTIFICATENAME",
    "RingtailLegalApplicationServer|WEBSERSSLUSAGE": "WEBSERSSLUSAGE",
    "RingtailLegalApplicationServer|WEBBROWSERPROTOCOL": "WEBBROWSERPROTOCOL",

    "Ringtail8|IS_SQLSERVER_SERVER": "IS_SQLSERVER_SERVER_PORTAL",
    "Ringtail8|IS_SQLSERVER_USERNAME": "IS_SQLSERVER_USERNAME_PORTAL",
    "Ringtail8|IS_SQLSERVER_PASSWORD": "IS_SQLSERVER_PASSWORD_PORTAL",
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
    "Ringtail8|SELFSERVICEAUTHENTICATIONMODE": "SELFSERVICEAUTHENTICATIONMODE",

    "RingtailConfigurator|CONFIGURATORPORT": "CONFIGURATORPORT",
    "RingtailConfigurator|HOST": "CONFIGURATORHOST",
    "RingtailConfigurator|NT_DOMAIN": "CONFIGURATOR_NT_DOMAIN",
    "RingtailConfigurator|NT_USER": "CONFIGURATOR_NT_USER",
    "RingtailConfigurator|NT_PASSWORD": "CONFIGURATOR_NT_PASS",
    "RingtailConfigurator|IS_SQLSERVER_SERVER": "IS_SQLSERVER_SERVER_PORTAL",
    "RingtailConfigurator|IS_SQLSERVER_USERNAME": "IS_SQLSERVER_USERNAME_PORTAL",
    "RingtailConfigurator|IS_SQLSERVER_PASSWORD": "IS_SQLSERVER_PASSWORD_PORTAL",
    "RingtailConfigurator|IS_SQLSERVER_DATABASE": "IS_SQLSERVER_DATABASE_PORTAL",
    "RingtailConfigurator|CONFIG_USERNAME": "CONFIGURATOR_CONFIG_USERNAME",
    "RingtailConfigurator|CONFIG_PASSWORD": "CONFIGURATOR_CONFIG_PASSWORD",
    "RingtailConfigurator|DB_PORT": "CONFIGURATOR_DB_PORT",
    "RingtailConfigurator|AGENT_VIRTUAL_NAME": "CONFIGURATOR_AGENT_VIRTUAL_NAME",
    "RingtailConfigurator|APP_POOL": "CONFIGURATOR_APP_POOL",
    "RingtailConfigurator|AGENT_APP_POOL": "CONFIGURATOR_AGENT_APP_POOL",

    "RingtailProcessingFrameworkWorkers|RPFWORKERPATH": "RPFWORKERPATH",

    "Ringtail-Portal|PortalDBServer": "IS_SQLSERVER_SERVER_PORTAL",
    "Ringtail-Portal|PortalDBName": "IS_SQLSERVER_DATABASE_PORTAL",
    "Ringtail-Portal|PortalDBUser": "IS_SQLSERVER_USERNAME_PORTAL",
    "Ringtail-Portal|PortalDBPassword": "IS_SQLSERVER_PASSWORD_PORTAL",
    "Ringtail-Portal|RpfDBServer": "IS_SQLSERVER_SERVER_RPF",
    "Ringtail-Portal|RpfDBName": "IS_SQLSERVER_DATABASE_RPF",
    "Ringtail-Portal|RpfDBUser": "IS_SQLSERVER_USERNAME_RPF",
    "Ringtail-Portal|RpfDBPassword": "IS_SQLSERVER_PASSWORD_RPF",
    "Ringtail-Portal|RpfDBPort": "CONFIGURATOR_DB_PORT",

    "RingtailProcessingFramework|ADDLOCAL": "RPFINSTALL",
    "RingtailProcessingFramework|IS_SQLSERVER_SERVER": "IS_SQLSERVER_SERVER_RPF",
    "RingtailProcessingFramework|IS_SQLSERVER_USERNAME": "IS_SQLSERVER_USERNAME_RPF",
    "RingtailProcessingFramework|IS_SQLSERVER_PASSWORD": "IS_SQLSERVER_PASSWORD_RPF",
    "RingtailProcessingFramework|IS_SQLSERVER_DATABASE": "IS_SQLSERVER_DATABASE_RPF",
    "RingtailProcessingFramework|RINGTAILIISWEBAPPLICATIONNAME": "RPF_RINGTAILIISWEBAPPLICATIONNAME",
    "RingtailProcessingFramework|RINGTAILIISVIRTUALDIRECTORYPHYSICALPATH": "RPF_RINGTAILIISVIRTUALDIRECTORYPHYSICALPATH",
    "RingtailProcessingFramework|RT_COORDINATOR_URL": "RT_COORDINATOR_URL",
    "RingtailProcessingFramework|SERVICEUSERNAME": "SERVICEUSERNAME",
    "RingtailProcessingFramework|SERVICEPASSWORD": "SERVICEPASSWORD",
    "RingtailProcessingFramework|RPFWORKERPATH": "RPFWORKERPATH",

    "Ringtail-Svc-ContentSearch|SERVICEUSERNAME": "SEARCH_SERVICEUSERNAME",
    "Ringtail-Svc-ContentSearch|SERVICEPASSWORD": "SEARCH_SERVICEPASSWORD",

    "NativeFileServiceSetup|SERVICEUSER": "NATIVE_FILE_SERVICEUSER",
    "NativeFileServiceSetup|SERVICEPASSWORD": "NATIVE_FILE_SERVICEPASSWORD",
    "NativeFileServiceSetup|NATIVEFILESERVICESERVERS": "NATIVE_FILE_SERVERS",

    "Common|UNINSTALL_EXCLUSIONS": "UNINSTALL_EXCLUSIONS"
  };


  fields = [
    {
      "key": "UNKNOWN",
      "title": "Unknown field",
    },
    {
      "key": "IS_SQLSERVER_SERVER_PORTAL",
      "title": "Portal Database Server Name",
      "description": "The instance name of the SQL server that contains the Ringtail Portal database.",
    },
    {
      "key": "IS_SQLSERVER_USERNAME_PORTAL",
      "title": "Portal Database Server Login",
      "description": "The SQL Server username used to connect to the SQL server.",
      "default": "sa"
    },
    {
      "key": "IS_SQLSERVER_PASSWORD_PORTAL",
      "title": "Portal Database Server Password",
      "description": "The SQL Server password used to connect to the SQL server."
    },
    {
      "key": "IS_SQLSERVER_DATABASE_PORTAL",
      "title": "Portal Database",
      "description": "The Portal database name"
    },
    {
      "key": "IS_SQLSERVER_SERVER_RPF",
      "title": "Ringtail Processing Framework Database Server Name",
      "description": "The instance name of the SQL server that contains the Ringtail Processing Framework database."
    },
    {
      "key": "IS_SQLSERVER_USERNAME_RPF",
      "title": "Ringtail Processing Framework Database Login",
      "description": "The SQL Server username used to connect to the SQL server.",
      "default": "sa"
    },
    {
      "key": "IS_SQLSERVER_PASSWORD_RPF",
      "title": "Ringtail Processing Framework Database Password",
      "description": "The SQL Server password used to connect to the SQL server."
    },
    {
      "key": "IS_SQLSERVER_DATABASE_RPF",
      "title": "Ringtail Processing Framework Database",
      "description": "The RPF database name"
    },
    {
      "key": "WEBUSER",
      "title": "Ringtail database user",
      "description": "The Ringtail database user",
      "default": "webuser"
    },
    {
      "key": "RINGTAILSTSURL",
      "title": "Ringtail Security Token Service URL",
      "description": "The URL of the Ringtail STS Application. (e.g.: http://host/RingtailSTS)",
      "type": "url",
      "defaultPath": "RingtailSTS"
    },
    {
      "key": "RMCIISWEBAPPLICATIONURL",
      "title": "Ringtail Management Console URL",
      "description": "The URL of the Ringtail Management Console Application. (e.g. http://host/RMC)",
      "type": "url",
      "defaultPath": "RMC"
    },
    {
      "key": "LEGALPATH",
      "title": "Ringtail Legal Application Name",
      "description": "The Ringtail Legal Application name (e.g. Classic)",
      "default": "Classic"
    },
    {
      "key": "RINGTAILSTSCERTIFICATETHUMBPRINT",
      "title": "Certificate Thumbprint",
      "description": "The thumbprint of the installed Ringtail Secure Token Service (STS) certificate.",
      "default": "2c 3f 36 e4 cc b3 24 82 d9 66 11 69 1e e7 2a 5a 2c 0e c4 30",
    },
    {
      "key": "RINGTAILSTSCERTIFICATENAME",
      "title": "Certificate Name",
      "description": "The name of the certificate used by the Ringtail Secure Token Service (STS) to sign tokens with.",
      "default": "RingtailSTS"
    },
    {
      "key": "WEBSERSSLUSAGE",
      "title": "Web Server SSL Usage",
      "description": "The Web Server (IIS) is configured to use SSL: true, false (select 'false' if SSL is handled by the Load Balancer).",
      "default": "false",
      "options": ["false", "true"]
    },
    {
      "key": "WEBBROWSERPROTOCOL",
      "title": "Client Web Browser Protocol",
      "description": "Specify the protocol used by the client web browser when accessing Ringtail; select either http or https.",
      "default": "http",
      "options": ["http", "https"],
      "type": "protocol"
    },
    {
      "key": "RINGTAILIISWEBAPPLICATIONNAME",
      "title": "Ringtail Web Application Name",
      "description": "The full site path where you want to install the Ringtail Web Application. (e.g. Default Web Site/Ringtail)",
      "default": "Default Web Site/Ringtail",
      "ignoreWhen": "Default Web Site/Ringtail"
    },
    {
      "key": "RINGTAILWEBAPPNAME",
      "title": "Ringtail Web Application Name",
      "description": "The Ringtail Web Application name (e.g. Ringtail)",
      "default": "Ringtail",
      "ignoreWhen": "Ringtail"
    },
    {
      "key": "RINGTAILIISVIRTUALDIRECTORYPHYSICALPATH",
      "title": "Ringtail Web Application Physical Path",
      "description": "The physical path where the files for the Web application will be deployed.",
      "default": "C:\\inetpub\\wwwroot\\Ringtail\\",
      "ignoreWhen": "C:\\inetpub\\wwwroot\\Ringtail\\"
    },
    {
      "key": "RINGTAILSTSIISAPPLICATIONNAME",
      "title": "Ringtail STS Application Name",
      "description": "The full site path where you want to install the Ringtail STS Application (e.g. Default Web Site/RingtailSTS",
      "default": "Default Web Site/RingtailSTS",
      "ignoreWhen": "Default Web Site/RingtailSTS"
    },
    {
      "key": "RINGTAILSTSIISVIRTUALDIRECTORYPHYSICALPATH",
      "title": "Ringtail STS Physical Path",
      "description": "The physical path where the files for the Ringtail STS application will be deployed.",
      "default": "C:\\inetpub\\wwwroot\\RingtailSTS\\",
      "ignoreWhen": "C:\\inetpub\\wwwroot\\RingtailSTS\\"
    },
    {
      "key": "RINGTAILUIIISAPPLICATONNAME",
      "title": "Ringtail UI Static Application Name",
      "description": "The full site path where you want to install the Ringtail UI Static Application (e.g. Default Web Site/UIStatic).",
      "default": "Default Web Site/UIStatic",
      "ignoreWhen": "Default Web Site/UIStatic"
    },
    {
      "key": "RINGTAILUIIISVIRTUALDIRECTORYPHYSICALPATH",
      "title": "Ringtail UI Static Content Physical Path",
      "description": "The physical path where the files for the Ringtail UI Static Application will be deployed.",
      "default": "C:\\inetpub\\wwwroot\\UIStatic\\",
      "ignoreWhen": "C:\\inetpub\\wwwroot\\UIStatic\\"
    },
    {
      "key": "RLMIISWEBAPPLICATIONNAME",
      "title": "Ringtail License Management Application Name",
      "description": "The full site path where you want to install Ringtail License Management (e.g. Default Web Site/RingtailLicenseManagment).",
      "default": "Default Web Site/RingtailLicenseManagement",
      "ignoreWhen": "Default Web Site/RingtailLicenseManagement"
    },
    {
      "key": "RLMIISVIRTUALDIRECTORYPHYSICALPATH",
      "title": "Ringtail License Management Physical Path",
      "description": "The physical path where files for Ringtail License Management will be deployed.",
      "default": "C:\\inetpub\\wwwroot\\RingtailLicenseManagement\\",
      "ignoreWhen": "C:\\inetpub\\wwwroot\\RingtailLicenseManagement\\"
    },
    {
      "key": "RMCIISWEBAPPLICATIONNAME",
      "title": "Ringtail Management Console Application Name",
      "description": "The full site path where you want to install Ringtail Management Console (e.g. Default Web Site/RMC).",
      "default": "Default Web Site/RMC",
      "ignoreWhen": "Default Web Site/RMC",
    },
    {
      "key": "RMCAPPNAME",
      "title": "Ringtail Management Console Application Name",
      "description": "The Ringtail Management Console Application name (e.g. RMC)",
      "default": "RMC",
      "ignoreWhen": "RMC"
    },
    {
      "key": "RMCIISVIRTUALDIRECTORYPHYSICALPATH",
      "title": "Ringtail Management Console Physical Path",
      "description": "The physical path where files for Ringtail Management Console will be deployed.",
      "default": "C:\\inetpub\\wwwroot\\RMC\\",
      "ignoreWhen": "C:\\inetpub\\wwwroot\\RMC\\"
    },
    {
      "key": "RINGTAILIISWEBAPPLICATIONURL",
      "title": "Ringtail Web Application URL",
      "description": "The Ringtail Web Application URL (e.g. http://host/Ringtail)",
      "type": "url",
      "defaultPath": "Ringtail"
    },
    {
      "key": "RINGTAILUISTATICCONTENTURL",
      "title": "Ringtail UI Static Content URL",
      "description": "The Ringtail UI Static Content URL (e.g. http://host/UIStatic)",
      "type": "url",
      "defaultPath": "UIStatic"
    },
    {
      "key": "RINGTAILCLASSICURL",
      "title": "Ringtail Legal Application URL",
      "description": "The Ringtail Legal (Classic) Application URL (e.g. http://host/Classic)",
      "type": "url",
      "defaultPath": "Classic"
    },
    {
      "key": "RINGTAILHELPURL",
      "title": "Ringtail Help URL",
      "description": "The Ringtail Help URL (e.g. http://host/RingtailHelp)",
      "type": "url",
      "defaultPath": "RingtailHelp"
    },
    {
      "key": "IISAUTHENTICATIONMETHOD",
      "title": "IIS Authentication Method",
      "description": "Select 'Forms' for users to connect to Ringtail using Ringtail Authentication, or select 'Windows' to use Windows Authentication.",
      "default": "Forms",
      "options": ["Forms", "Windows"]
    },
    {
      "key": "RINGTAILSTSCERTIFICATEISSUERNAME",
      "title": "Certificate Issuer Name",
      "description": "The 'Issued By' name for the Ringtail Secure Token Service (STS) to sign tokens with.",
      "default": "RingtailSTS"
    },
    {
      "key": "RINGTAILCLASSICWEBSITENAME",
      "title": "Ringtail Legal (Classic) Web Site Name",
      "description": "The web site name where the Ringtail Legal (Classic) mapping is located. (e.g. Default Web Site)",
      "default": "Default Web Site",
      "ignoreWhen": "Default Web Site",
    },
    {
      "key": "RINGTAILCLASSICWEBSITEMAPPING",
      "title": "Ringtail Legal Web Site Mapping",
      "description": "The web site mapping that is used for Ringtail Legal (Classic) (e.g. Classic)",
      "default": "Classic",
      "ignoreWhen": "Legal",
    },
    {
      "key": "SELFSERVICEAUTHENTICATIONMODE",
      "title": "Self Service Authentication Mode",
      "description": "Self-service Authentication Mode that will be used",
      "default": "Ringtail",
      "options": ["Ringtail", "ADSelfService"]
    },
    {
      "key": "DATACAMEL_ACTION",
      "title": "Database Upgrade Action",
      "description": "Update individual database or the portal an all attached cases",
      "default": "portal",
      "options": ["upgrade", "upgradeportal"]
    },
    {
      "key": "DATACAMEL_DATABASES",
      "title": "Databases to Upgrade",
      "description": "The portal name or a list of comma separated cases"
    },
    {
      "key": "CONFIGURATORPORT",
      "title": "Configurator Port",
      "description": "The port that the Ringtail Configurator will listen on",
      "default": "10000"
    },
    {
      "key": "CONFIGURATORHOST",
      "title": "Configurator Host",
      "description": "The host that the Ringtail Configurator is installed on",
      "default": "localhost"
    },
    {
      "key": "CONFIGURATOR_NT_DOMAIN",
      "title": "Configurator NT Domain",
      "description": "The domain for the user that has access to the Ringtail Configurator"
    },
    {
      "key": "CONFIGURATOR_NT_USER",
      "title": "Configuator NT User",
      "description": "The user that has access to the Ringtail Configurator",
    },
    {
      "key": "CONFIGURATOR_NT_PASS",
      "title": "Configurator NT Password",
      "description": "The user's password that has access to the Ringtail Configurator"
    },
    {
      "key": "CONFIGURATOR_CONFIG_USERNAME",
      "title": "Ringtail Database User",
      "description": "The Ringtail Database User name (e.g. webuser)",
      "default": "webuser"
    },
    {
      "key": "CONFIGURATOR_CONFIG_PASSWORD",
      "title": "Ringtail Database User Password",
      "description": "The password for the Ringtail Database User"
    },
    {
      "key": "CONFIGURATOR_AGENT_VIRTUAL_NAME",
      "title": "Agent Virtual Name",
      "description": "Virtual name for the agent used by the configurator",
      "default": "Agent"
    },
    {
      "key": "CONFIGURATOR_APP_POOL",
      "title": "App Pool Name",
      "description": "The App Pool Name used by the configurator for the Legal mapping",
      "default": "DefaultAppPool"
    },
    {
      "key": "CONFIGURATOR_AGENT_APP_POOL",
      "title": "Agent App Pool Name",
      "description": "The Agent App Pool Name used by the configurator for the Primary agent mapping",
      "default": "DefaultAppPool"
    },
    {
      "key": "CONFIGURATOR_DB_PORT",
      "title": "Configurator Portal database port",
      "description": "The port the configurator will use to connect to the Portal database",
      "default": "1433"
    },
    {
      "key": "RPFWORKERPATH",
      "title": "Ringtail Processing Framework Worker UNC Share Path",
      "description": "Enter the UNC share path to the RPF Workers folder (e.g. \\\\127.0.0.1\\RPF_Workers)"
    },
    {
      "key": "RPFINSTALL",
      "title": "Ringtail Processing Framework Features",
      "description": "The Ringtail Processing Framework features to install",
      "default": "All",
      "options": ["All", "COORD", "SUPERVISOR"]
    },
    {
      "key": "RPF_RINGTAILIISWEBAPPLICATIONNAME",
      "title": "Ringtail Processing Framework Coordinator Application Name",
      "description": "The full site path where you want to install the Ringtail Coordinator Application. (e.g. Default Web Site/Coodinator)",
      "default": "Default Web Site/Coordinator",
      "ignoreWhen": "Default Web Site/Coordinator"
    },
    {
      "key": "RPF_RINGTAILIISVIRTUALDIRECTORYPHYSICALPATH",
      "title": "Ringtail Processing Framework Coodinator Physical Path",
      "description": "The physical path where the files for the Web application will be deployed.",
      "default": "C:\\inetpub\\wwwroot\\Coodinator\\",
      "ignoreWhen": "C:\\inetpub\\wwwroot\\Coodinator\\"
    },
    {
      "key": "RT_COORDINATOR_URL",
      "title": "Ringtail Coodinator URL",
      "description": "The URL where the coordinator is acccessed (e.g. http://CoordinatorMachineIP/Coodinator)"
    },
    {
      "key": "SERVICEUSERNAME",
      "title": "Ringtail Process Framework Service 'Log on as' User",
      "description": "The user account that the RPF Service will Log on as (e.g. DomainName\\UserName)"
    },
    {
      "key": "SERVICEPASSWORD",
      "title": "Ringtail Process Framework Service 'Log on as' Password",
      "description": "The password for the user account that the RPF Service will Log on as"
    },
    {
      "key": "SEARCH_SERVICEUSERNAME",
      "title": "Ringtail Search Service 'Log on as' User",
      "description": "The user account that the Search Service will Log on as (e.g. DomainName\\UserName)"
    },
    {
      "key": "SEARCH_SERVICEPASSWORD",
      "title": "Ringtail Search Service 'Log on as' Password",
      "description": "The password for the user account that the Search Service will Log on as"
    },    
    {
      "key": "NATIVE_FILE_SERVICEUSER",
      "title": "Native File Viewer Service Account",
      "description": "The service account used for native file viewer"
    },
    {
      "key": "NATIVE_FILE_SERVICEPASSWORD",
      "title": "Native File Viewer Service Account Password",
      "description": "The service account password used for the native file viewer"
    },
    {
      "key": "NATIVE_FILE_SERVERS",
      "title": "Native File Viewer Server",
      "description": "The server used by native file viewer"
    },
    {
      "key": "UNINSTALL_EXCLUSIONS",
      "title": "Uninstall Exclusions",
      "description": "Applications which should not be uninstalled. (hold ctrl to select multiple)",
      "multioptions": [
          "Ringtail SQLComponent (x64)"
        , "Ringtail Database Utility"
        , "Ringtail Processing Framework"
        , "Ringtail Processing Framework Workers"
        // , "Ringtail NIST Reference"
        // , "Ringtail Help"
        // , "Ringtail Basis Library"
        // , "Ringtail Agent Server"
        // , "Ringtail"        
        // , "Ringtail Application Server"
      ],
      "default" : "",
      "ignoreValidation": true
    }
  ];
  /* eslint-enable */
}());