module.exports = function(grunt) {

  grunt.initConfig({
    lint: {
      files: ['src/client.js']
    }
  });

  grunt.registerTask('default', 'lint');
  grunt.registerTask('travis', 'lint');

};
