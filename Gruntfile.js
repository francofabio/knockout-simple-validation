'use strict';

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
            ' */\n',
    // Task configuration.
    clean: {
      dist: ['dist/']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true,
        process: function(src, filepath) {
          return '// Source: ' + filepath + '\n' + src;
        }
      },
      dist: {
        src: [
          'src/ksv.js'
        ],
        dest: 'dist/<%= pkg.dist %>-<%= pkg.version %>.js'
      },
      dist_lang_ptBR: {
        src: [
          'src/ksv.pt_BR.js'
        ],
        dest: 'dist/<%= pkg.dist %>.pt_BR-<%= pkg.version %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.dist %>-<%= pkg.version %>.min.js'
      },
      dist_lang_ptBR: {
        src: '<%= concat.dist_lang_ptBR.dest %>',
        dest: 'dist/<%= pkg.dist %>.pt_BR-<%= pkg.version %>.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: 'jshint.json'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['src/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src_test: {
        files: ['<%= jshint.src.src %>', '<%= qunit.files %>'],
        tasks: ['jshint:src', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('default', ['clean', 'jshint', 'qunit', 'concat', 'uglify']);

};
