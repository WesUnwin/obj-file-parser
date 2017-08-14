# obj-file-parser
Open source, re-usable Wavefront 3D object file (.OBJ) parser written
in javascript and distributed freely as an NPM package.


## Features

  * Support for (.OBJ) files only, see mtl-file-parser for mtl files
  * Case insensitive, flexible parser
  * Simple JS object output


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
obj-file-parser is being actively maintained and developed, and is
expected to reach stability soon. Comments, feedback and bug reports
always welcome.

