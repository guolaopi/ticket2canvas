# ticket2canvas

Paint ticket in canvas and you can export it as Base64 string

# useage

```js
import ticket2canvas from "ticket2canvas";
ticket2canvas({
    /* option according below */
});
```

# option

```js
{
    el: "#cvs", // target canvas id. append to body if empty
    showCanvas: true, // whether show the default canvas, default is false
    json: {
        width: 100, // canvas's width, default is 300
        height: 200, // canvas's height, default is 600
        list: [
            // contents to print
            {
                type: "text", // content type, allow 'text'|'barcode'|'qrcode'
                content: "hello world",
                fontSize: 16, // font-size, it's a Number-type, default is 16
                fontFamily: "Microsoft YaHei", // fontFamily, default is 'Microsoft YaHei'
                bold: true, // whether the font is bold
                width: 200, // only use for 'barcode'|'qrcode', default is 100
                height: 200, // only use for 'barcode'|'qrcode', default is 100
                left: 20, // content's left margin to canvas, default is 0
                top: 20, // content's top margin to canvas, default is 0
            },
        ],
    },
};
```
