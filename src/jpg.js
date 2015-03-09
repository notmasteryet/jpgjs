/**
 * @license
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

function loadURLasArrayBuffer(path, callback) {
  if (path.indexOf("data:") === 0) {
    var offset = path.indexOf("base64,") + 7;
    var data = atob(path.substring(offset));
    var arr = new Uint8Array(data.length);
    for (var i = data.length - 1; i >= 0; i--) {
      arr[i] = data.charCodeAt(i);
    }
    callback(arr.buffer);
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("GET", path, true);
  xhr.responseType = "arraybuffer";
  xhr.onload = function() {
    callback(xhr.response);
  };
  xhr.send(null);
}

var JpegImage = (function jpegImage() {
  function JpegImage() {
    this._src = null;
    this._parser = new PDFJS.JpegImage();
    this.onload = null;
  }

  JpegImage.prototype = {
    get src() {
      return this._src;
    },

    set src(value) {
      this.load(value);
    },

    get width() {
      return this._parser.width;
    },

    get height() {
      return this._parser.height;
    },

    load: function load(path) {
      this._src = path;

      loadURLasArrayBuffer(path, function (buffer) {
        this.parse(new Uint8Array(buffer));
        if (this.onload) {
          this.onload();
        }
      }.bind(this));
    },

    parse: function (data) {
      this._parser.parse(data);
    },

    getData: function (width, height) {
      return this._parser.getData(width, height, false);
    },

    copyToImageData: function copyToImageData(imageData) {
      if (this._parser.numComponents === 2 || this._parser.numComponents > 4) {
        throw new Error('Unsupported amount of components');
      }

      var width = imageData.width, height = imageData.height;
      var imageDataBytes = width * height * 4;
      var imageDataArray = imageData.data;

      var i, j;
      if (this._parser.numComponents === 1) {
        var values = this._parser.getData(width, height, false);
        for (i = 0, j = 0; i < imageDataBytes;) {
          var value = values[j++];
          imageDataArray[i++] = value;
          imageDataArray[i++] = value;
          imageDataArray[i++] = value;
          imageDataArray[i++] = 255;
        }
        return;
      }

      var rgb = this._parser.getData(width, height, true);
      for (i = 0, j = 0; i < imageDataBytes;) {
        imageDataArray[i++] = rgb[j++];
        imageDataArray[i++] = rgb[j++];
        imageDataArray[i++] = rgb[j++];
        imageDataArray[i++] = 255;
      }
    }
  };

  return JpegImage;
})();

if (typeof exports === 'function') {
  module.exports = {
    JpegImage: JpegImage,

    JpegDecoder: JpegDecoder,
    JpxDecoder: JpxDecoder,
    Jbig2Decoder: Jbig2Decoder
  };
}
