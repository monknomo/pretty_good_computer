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
    },
    cssmin: {
        dist: {
            files: [
                {
                    expand:true,
                    cwd: '.',
                    src: ['pretty_good_computer.css'],
                    dest: 'build',
                    ext: '.min.css'
                }
            ]
        }
    },
    processhtml: {
        options: {
            
        },
        dist: {
            files: {
                'build/index.html': ['index.html']
            }
        }
    },
    'gh-pages':{
        options:{
            base: 'build'
        },
        src:['index.html']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-gh-pages');

  // Default task(s).
  grunt.registerTask('default', ['concat','uglify','cssmin', 'processhtml','gh-pages']);

};