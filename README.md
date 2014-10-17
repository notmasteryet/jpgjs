jpgjs
=====

Simple JPEG/DCT data decoder in JavaScript.

Example URL: http://notmasteryet.github.com/jpgjs/example.html


Usage
-----

```js
var jpeg = new JpegImage('j1.jpg');

jpeg.load(function (jpeg) {
  console.log(jpeg);
  // jpeg.data:
  // jpeg.width:
  // jpeg.height:
});
```


API
---

`new JpegImage([src])`
Define new instance with the image source.

`JpegImage.load([src], [onload])`
Invoke the loading of the image.

`JpegImage.copyToImageData(imageData)`
Transfer image data intoa  another imagaData.
