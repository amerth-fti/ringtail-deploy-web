module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-traceur');

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
    }
  });

}