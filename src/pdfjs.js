/* Copyright 2015 Mozilla Foundation
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

var PDFJS;
(function (PDFJS) {

//#include "../pdf.js/src/core/jpg.js"
//#include "../pdf.js/src/core/arithmetic_decoder.js"
//#include "../pdf.js/src/core/jpx.js"
//#include "../pdf.js/src/core/jbig2.js"

  // Some PDF.js utility functions

  function log2(x) {
    var n = 1, i = 0;
    while (x > n) {
      n <<= 1;
      i++;
    }
    return i;
  }

  function readInt8(data, start) {
    return (data[start] << 24) >> 24;
  }

  function readUint16(data, offset) {
    return (data[offset] << 8) | data[offset + 1];
  }

  function readUint32(data, offset) {
    return ((data[offset] << 24) | (data[offset + 1] << 16) |
      (data[offset + 2] << 8) | data[offset + 3]) >>> 0;
  }

  function shadow(obj, prop, value) {
    Object.defineProperty(obj, prop, { value: value,
      enumerable: true,
      configurable: true,
      writable: false });
    return value;
  }

  var error = function () {
    console.error.apply(console, arguments);
    throw new Error('PDFJS error: ' + arguments[0]);
  };
  var warn = function () {
    console.warn.apply(console, arguments);
  };
  var info = function () {
    console.info.apply(console, arguments);
  };

  // TODO add parsing of entire JBIG2 file to the PDF.js
  Jbig2Image.prototype.parse = function parseJbig2(data) {
    var position = 0, end = data.length;
    if (data[position] !== 0x97 || data[position + 1] !== 0x4A ||
      data[position + 2] !== 0x42 || data[position + 3] !== 0x32 ||
      data[position + 4] !== 0x0D || data[position + 5] !== 0x0A ||
      data[position + 6] !== 0x1A || data[position + 7] !== 0x0A) {
      error('JBIG2 error: invalid header');
    }
    var header = {};
    position += 8;
    var flags = data[position++];
    header.randomAccess = !(flags & 1);
    if (!(flags & 2)) {
      header.numberOfPages = readUint32(data, position);
      position += 4;
    }
    // TODO expose visitor's data in the Jbig2Image,
    // currently we are patching the library in the Gruntfile.js
    var visitor = this.parseChunks([{data: data, start: position, end: end}]);
    var width = visitor.currentPageInfo.width;
    var height = visitor.currentPageInfo.height;
    var bitPacked = visitor.buffer;
    var data = new Uint8Array(width * height);
    var q = 0, k = 0;
    for (var i = 0; i < height; i++) {
      var mask = 0, buffer;
      for (var j = 0; j < width; j++) {
        if (!mask) {
          mask = 128; buffer = bitPacked[k++];
        }
        data[q++] = (buffer & mask) ? 0 : 255;
        mask >>= 1;
      }
    }
    this.width = width;
    this.height = height;
    this.data = data;
  };

  PDFJS.JpegImage = JpegImage;
  PDFJS.JpxImage = JpxImage;
  PDFJS.Jbig2Image = Jbig2Image;
})(PDFJS || (PDFJS = {}));

var JpegDecoder = PDFJS.JpegImage;
var JpxDecoder = PDFJS.JpxImage;
var Jbig2Decoder = PDFJS.Jbig2Image;
