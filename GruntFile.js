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
        options: 'spec',        
        src: ['test/**/*.js']
      }      
    },
    shell: {
      debug: {        
        command: 'node src/server/server.js'
      }
    }
  });


  grunt.registerTask('build', [ 'jshint', 'mochaTest' ]);
  grunt.registerTask('run', [ 'build', 'shell']);
  
};
