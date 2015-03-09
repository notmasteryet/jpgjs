/*
 * Copyright 2015 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      default: {
        options: {
          preserveComments: 'some',
          screwIE8: true,
          beautify: true,
          compress: false,
          mangle: false
        },
        files: {
          'jpg.js': ['src/jpg.js', 'build/pdfjs.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  function includeFiles(src, dest) {
    var fs = require('fs'), path = require('path');
    function process(src) {
      var content = fs.readFileSync(src).toString();
      return content.replace(/\/\/#include\s+"([^"]+)[^\n]+/g, function (all, file) {
        file = path.join(path.dirname(src), file);
        return process(file);
      });
    }
    fs.writeFileSync(dest, process(src));
  }

  grunt.registerTask('build-pdfjs', function () {
    grunt.file.mkdir('build');

    includeFiles('src/pdfjs.js', 'build/pdfjs.js');

    // HACK patching JBIG2, see also src/pdfjs.js
    var fs = require('fs');
    var content = fs.readFileSync('build/pdfjs.js').toString();
    fs.writeFileSync('build/pdfjs.js', content.replace('return visitor.buffer;', 'return visitor;'));
  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['build-pdfjs', 'uglify:default']);
};

