(function() {
  'use strict';

  angular
    .module('shared.data')
    .service('RingtailConfig', RingtailConfig);

  RingtailConfig.$inject = [ '$http' ];


  var keyData = {
    // Ringtail SQL Components
    'IS_SQLSERVER_SERVER': 'The instance name of the SQL server that contains the Ringtail Portal database.',
    'IS_SQLSERVER_USERNAME': 'The SQL Server username (“sa”) used to connect to the SQL server.',
    'IS_SQLSERVER_PASSWORD': 'The SQL Server password used to connect to the SQL server.',    
    'WEBUSER': 'The Ringtail database user.',     

    // Ringtail Legal Application Server
    // IS_SQLSERVER_SERVER
    // IS_SQLSERVER_USERNAME
    // IS_SQLSERVER_PASSWORD
    // IS_SQLSERVER_DATABASE
    'IS_SQLSERVER_DATABASE': 'The Ringtail Portal database the application will connect to.',
    'RINGTAILSTSURL': 'The URL of the Ringtail STS Application.',
    'RMCIISWEBAPPLICATIONURL': 'The URL of the Ringtail Management Console Application.',
    'RINGTAILLEGALURL': 'The URL of the Ringtail Legal (Classic) Application.',
    'LEGALPATH': 'The Ringtail Legal Application name e.g. RTLC',
    'RINGTAILSTSCERTIFICATETHUMBPRINT': 'The thumbprint of the certificate installed.',
    'RINGTAILSTSCERTIFICATENAME': 'The certificate name.',
    'WEBSERSSLUSAGE': 'Will the web site will use SSL.',
    'WEBBROWSERPROTOCOL': 'The browser protocol that will be used.',

    // Ringtail Processing Framework
    // IS_SQLSERVER_SERVER
    // IS_SQLSERVER_USERNAME
    // IS_SQLSERVER_PASSWORD
    // IS_SQLSERVER_DATABASE
    'RINGTAILIISWEBAPPLICATIONNAME': 'The Ringtail Coordinator Application name e.g. Default Web Site/Coordinator',
    'RINGTAILIISVIRTUALDIRECTORYPHYSICALPATH': 'The physical path to where the Ringtail Coordinator application files will get deployed to.',
    'RT_COORDINATOR_URL': 'The Ringtail Coordinator URL used to allow communication with the Ringtail Supervisor.',
    'SERVICEUSERNAME': 'The service account used to start the Ringtail RPF Supervisor service.',
    'SERVICEPASSWORD': 'The service account password used to start the Ringtail RPF Supervisor service.',
    'RPFWORKERPATH': 'The UNC path to the workers folder that is installed with the Ringtail Coordinator feature.'

    // Ringtail8
    // IS_SQLSERVER_SERVER
    // IS_SQLSERVER_USERNAME
    // IS_SQLSERVER_PASSWORD
    // IS_SQLSERVER_DATABASE
    // RINGTAILIISWEBAPPLICATIONAME
  };

  function RingtailConfig($http) {    
    return {
      combine: combine,
      dedup: dedup,
      details: details,
      get: get,          
      split: split
    };

    function get(role) {      
      // TODO this url path will need to be configurable to support 
      // use from the service as well as the deployer application
      return $http.get('/api/ringtail/configs', { params: { role: role }});
    }

    function details(config) {
      var key = split(config).key;
      var result = keyData[key];
      if(!result) {
        result = 'Unknown';
      }
      return result;
    }

    function split(config) {
      var parts = config.split('|');
      return {
        application: parts[0],
        key: parts[1]
      };
    }

    function combine(config) {
      return config.application + '|' + config.key;
    }

    function dedup(configs) {
      var lookup = { }
        , results = [ ]
        , key
        ;

      // iterate each
      configs.forEach(function(config) {
        var configObj = split(config)
          , key = configObj.key
          , hit = lookup[key];
  
        // add to lookup
        if(!hit) {
          lookup[key] = configObj;
        } 
        // dupe hit, update to common
        else {
          lookup[key].application = 'Common';
        }
      });


      // generate configs
      for(key in lookup) {
        if(lookup.hasOwnProperty(key)) {
          results.push(combine(lookup[key]));
        }
      }
      return results;
    }    
  }

}());