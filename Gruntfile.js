module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
        options: {
            stripBanners: true,
            banner: ''
        },
        dist: {
            src:['node_modules/jquery/dist/jquery.min.js','node_modules/ace-builds/src-min-noconflict/ace.js','node_modules/ace-builds/src-min-noconflict/theme-tomorrow_night_eighties.js','src/<%= pkg.name %>.js'],
            dest:"build/<%= pkg.name %>.concat.js"
        }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/<%= pkg.name %>.concat.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['concat','uglify']);

};