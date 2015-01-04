
module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-traceur');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-express-runner');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
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
      options: {
        jshintrc: true
      },
      grunt: {
        src: [ 'GruntFile.js' ]        
      },
      server: {
        src: [ 'src/server/**/*.js' ]        
      },
      test: {
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
    expressrunner: {
      options: {
        script: 'src/server/server.js',
        debug: 'deployer*'
      }
    },
    watch: {
      server: { 
        files: 'src/server/**/*',
        tasks: ['run'],
        options: {
          interrupt: true,
          atBegin: true
        }
      }
    }
  });

  grunt.registerTask('validate', [ 'jshint', 'mochaTest' ]);  
  grunt.registerTask('run', [ 'expressrunner']);
  
};
