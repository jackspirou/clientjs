module.exports = function(grunt) {

  grunt.initConfig({
    lint: {
      files: ['dist/client.min.js']
    }
  });

  grunt.registerTask('default', 'jshint');
  grunt.registerTask('travis', 'jshint');

};
