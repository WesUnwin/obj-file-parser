# obj-file-parser
Open source, re-usable Wavefront 3D object file (.OBJ) parser written
in javascript and distributed freely as an NPM package.

## Features

  * Support for (.OBJ) files only, see mtl-file-parser for mtl files
  * Case insensitive, flexible parser
  * Simple JS object output


## Installation

npm install --save obj-file-parser


## Output
The extracted model and material library references
are returned in the following format:

```javascript
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

