module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-traceur');
  grunt.loadNpmTasks('grunt-contrib-jshint');

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
    }    
  });

}