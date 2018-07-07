[![npm version](https://badge.fury.io/js/obj-file-parser.svg)](https://badge.fury.io/js/obj-file-parser)
[![Build Status](https://travis-ci.org/WesUnwin/obj-file-parser.svg?branch=master)](https://travis-ci.org/WesUnwin/obj-file-parser)

# obj-file-parser
Open source, re-usable Wavefront 3D object file (.OBJ) parser written
in javascript and distributed freely as an NPM package.


## Features

  * Support for (.OBJ) files only, see mtl-file-parser for mtl files
  * Case insensitive, flexible parser
  * Simple JS object output
  * Polygon group support
  * Smoothing group support
  * ES5 syntax for support across virtually all platforms
  * No dependencies

## Installation

```javascript
npm install --save obj-file-parser
```

## Usage

```javascript
const OBJFile = require('obj-file-parser');

const fileContents =
  'v 0 0 0 \n' +
  'v 0 1 0 \n' +
  'v 1 0 0 \n' +
  'f 1 2 3';

const objFile = new OBJFile(fileContents);

const output = objFile.parse(); // see description below
```


## Output
The extracted model data and list of material library references
are returned in the following format:

```
{
  models: [
    {
      name: 'unit_cube',
      vertices: [
        { x: 1.0, 2.0, 3.0 },
        ...
      ],
      textureCoords: [
        { u: 1.0, v: 2.0, w: 3.0 },
        ...
      ],
      vertexNormals: [
        { x: 1.0, y: 2.0, z: 3.0 },
        ...
      ],
      faces: [
        {
          material: 'brick',
          group: 'group1',
          smoothingGroup: 0,
          vertices: [
            { vertexIndex: 1, textureCoordsIndex: 1, vertexNormalIndex: 1 },
            ...
          ]
        }
      ]
    },
    {
      ...
    }
  ],

  materialLibraries: [
    'mat_lib1.mtl',
    ...
  ]
}
```

## More to come
obj-file-parser is being actively maintained and developed. Comments, feedback and bug reports
always welcome.

## Donation
Help me make this obj-file-parser and other tools better!

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/WesUnwin)
