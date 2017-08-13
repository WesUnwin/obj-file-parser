'use strict';

class Polygon {

  constructor(materialName) {
    this.materialName = materialName;
    this.vertices = [];
  }

  addVertex(vertexIndex, textureCoordsIndex, normalIndex) {
    this.vertices.push({
      vertexIndex:        vertexIndex,
      textureCoordsIndex: textureCoordsIndex,
      normalIndex:        normalIndex
    });
  }

}

module.exports = Polygon;