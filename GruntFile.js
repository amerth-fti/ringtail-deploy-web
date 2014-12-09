
module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-traceur');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  
  grunt.initConfig({
    traceur: {
      options: {
        experimental: true,
        modules: 'inline'
      },
      custom: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['*.js'],
          dest: 'build'
        }]
      }
    },
    jshint: {
      grunt: {
        options: {
          "laxcomma": true
        },
        src: [ 'GruntFile.js' ]        
      },
      server: {
        options: {
          "laxcomma": true
        },
        src: [ 'src/server/**/*.js' ]        
      },
      test: {
        options: {
          "laxcomma": true,
          "expr": true
        },
        src: [ 'test/**/*.js' ]  
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },        
        src: ['test/**/*.js']
      }      
    },
    express: {
      options: {
        script: 'src/server/server.js',
        debug: 'deployer*'
      }
    }
  });


  grunt.registerTask('express', function() {
    var options = this.options({})
      , done = this.async()
      , path = require('path');
    
    if(options.debug) {
      process.env.DEBUG = options.debug;
    }

    require(path.resolve(options.script));
  });

  grunt.registerTask('validate', [ 'jshint', 'mochaTest' ]);
  grunt.registerTask('run', [ 'validate', 'express']);
  
};
