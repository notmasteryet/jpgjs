jpgjs
=====

Simple JPEG/DCT data decoder in JavaScript.

Example URL: http://notmasteryet.github.com/jpgjs/example.html


Quickstart
----------

Download the library ([jpg.js](/jpg.js)) and use a script to include it.

A bower package is available as well: ```js bower install jpgjs```

```html
<script type="text/javascript" src="/scripts/jpg.js"></script>
```


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

```js
new JpegImage([src])
```
Define new instance with the image source.

```js
JpegImage.load([src], [onload])
```
Invoke the loading of the image.

```js
JpegImage.copyToImageData(imageData)
```
Transfer image data intoa  another imagaData.
