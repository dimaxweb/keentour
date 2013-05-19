/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
//    pkg: '<json:CssLoader.json>',
//    meta: {
//      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
//        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
//        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
//        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
//        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
//    },

    min: {
      dist: {
        src: '../js/src/*.js',
        dest: '../dist/*.js'
      }
    },
    qunit: {
      files: ['test/unit/all.html']
    },
    lint: {
      files: ['grunt.js', 'js/*.js', 'test/unit/*.js']
    },

   watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {},
    concat: {
          dist: {
              src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
              dest: 'dist/<%= pkg.name %>.js'
          }
      }
  });

  // Default task.
  grunt.registerTask('default', 'min');

};
