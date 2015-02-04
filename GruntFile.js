
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
        modules: 'commonjs',
        silent: true
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
      client: {
        src: [ 'src/client/**/*.js', '!src/client/assets/**/*' ]
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
        src: ['test/server/**/*.js']
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
        tasks: [ 'expressrunner' ],
        options: {
          interrupt: true,
          atBegin: true
        }
      }
    },
    copy: {
      server: {
        files: [{
          expand: true,
          cwd: 'src/server',
          src: [ '**/*.sql', '**/*.json' ],
          dest: 'build/server'
        }]
      },
      client: {
        files: [{
          expand: true,
          cwd: 'src/client',
          src: [ '**/*' ],
          dest: 'build/client'
        }]
      }
    }
  });

  grunt.registerTask('validate', [ 'jshint', 'mochaTest' ]);  
  grunt.registerTask('build', [ 'traceur', 'copy' ]);
  grunt.registerTask('run', [ 'watch' ]);
  
};
