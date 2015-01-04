
module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-traceur');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-express-runner');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  grunt.initConfig({
    traceur: {
      options: {
        experimental: true,
        modules: 'commonjs'
      },
      server: {
        files: [{
          expand: true,
          cwd: 'src/server',
          src: ['**/*.js'],
          dest: 'build/server'
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
        script: 'build/server/server.js',
        debug: 'deployer*'
      }
    },
    watch: {
      server: { 
        files: 'src/server/**/*',
        tasks: [ 'build', 'expressrunner' ],
        options: {
          interrupt: true,
          atBegin: true
        }
      }
    },
    copy: {
      options: {
        verbose: true
      },
      server: {
        files: [{
          expand: true,
          cwd: 'src/server',
          src: ['**/*.sql' ],
          dest: 'build/server'
        }]
      }
    }
  });

  grunt.registerTask('validate', [ 'jshint', 'mochaTest' ]);  
  grunt.registerTask('build', [ 'traceur', 'copy' ]);
  grunt.registerTask('run', [ 'watch' ]);
  
};
