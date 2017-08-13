'use strict';

const Model = require('./Model');
const Polygon = require('./Polygon');


class OBJFile {

  constructor(fileContents) {
    this._reset();
    this.fileContents = fileContents;
  }

  _reset() {
    this.models = [];
    this.currentMaterial = '';
    this.materialLibs = [];
  }

  parse() {
    this._reset();

    const lines = this.fileContents.split("\n");
    for(let i = 0; i < lines.length; i++) {
      const line = this._stripComments(lines[i]);

      const lineItems = line.replace(/\s\s+/g, ' ').trim().split(' ');
      
      switch(lineItems[0].toLowerCase())
      {
        case 'o':  // Start A New Model
          this._parseObject(lineItems);
          break;
        case 'g': // Start a new polygon group
          throw "NOT IMPLEMENTED";
          break;
        case 'v':  // Define a vertex for the current model
          this._parseVertexCoords(lineItems);
          break;
        case 'vt': // Texture Coords
          this._parseTextureCoords(lineItems);
          break;
        case 'vn': // Define a vertex normal for the current model
          this._parseVertexNormal(lineItems);
          break;
        case 's':  // Smooth shading statement
          this._parseSmoothShadingStatement(lineItems);
          break;
        case 'f': // Define a Face/Polygon
          this._parsePolygon(lineItems);
          break;
        case 'mtllib': // Reference to a material library file (.mtl)
          this._parseMtlLib(lineItems);
          break;
        case 'usemtl': // Sets the current material to be applied to polygons defined from this point forward
          this._parseUseMtl(lineItems);
          break;
      }

    }

    return {
      models: this.models,
      materialLibs: this.materialLibs
    };
  }

  _getDefaultModelName() {
    return 'default';
  }

  _currentModel() {
    if(this.models.length == 0)
      this.models.push(new Model(this._getDefaultModelName()));

    return this.models[this.models.length - 1];
  }

  _stripComments(lineString) {
    let commentIndex = lineString.indexOf('#');
    if(commentIndex > -1)
      return lineString.substring(0, commentIndex);
    else
      return lineString;
  }

  _parseObject(lineItems) {
    let modelName = lineItems.length >= 2 ? lineItems[1] : this._getDefaultModelName();
    this.models.push(new Model(modelName)); // Attach to list of models to be returned
  }

  _parseVertexCoords(lineItems) {
    let x = lineItems.length >= 2 ? parseFloat(lineItems[1]) : 0.0;
    let y = lineItems.length >= 3 ? parseFloat(lineItems[2]) : 0.0;
    let z = lineItems.length >= 4 ? parseFloat(lineItems[3]) : 0.0;
    
    this._currentModel().addVertex(x, y, z);
  }

  _parseTextureCoords(lineItems) {
    let u = lineItems.length >= 2 ? parseFloat(lineItems[1]) : 0.0;
    let v = lineItems.length >= 3 ? parseFloat(lineItems[2]) : 0.0;
    let w = lineItems.length >= 4 ? parseFloat(lineItems[3]) : 0.0;
    
    this._currentModel().addTextureCoords(u, v, w);
  }

  _parseVertexNormal(lineItems) {
    let x = lineItems.length >= 2 ? parseFloat(lineItems[1]) : 0.0;
    let y = lineItems.length >= 3 ? parseFloat(lineItems[2]) : 0.0;
    let z = lineItems.length >= 4 ? parseFloat(lineItems[3]) : 0.0;
    
    this._currentModel().addVertexNormal(x, y, z);
  }

  _parsePolygon(lineItems) {
    let totalVertices = (lineItems.length - 1);
    if(totalVertices < 3)
      throw ("Face statement has less than 3 vertices" + this.filePath + this.lineNumber);
    
    let polygon = new Polygon(this.currentMaterial);
    for(let i = 0; i<totalVertices; i++)
    {
      let vertexString = lineItems[i + 1];
      let vertexValues = vertexString.split("/");
      
      if(vertexValues.length < 1 || vertexValues.length > 3)
        throw ("Two many values (separated by /) for a single vertex" + this.filePath + this.lineNumber);
      
      let vertexIndex = 0;
      let textureCoordsIndex = 0;
      let vertexNormalIndex = 0;
      vertexIndex = parseInt(vertexValues[0]);
      if(vertexValues.length > 1 && (!vertexValues[1] == ""))
        textureCoordsIndex = parseInt(vertexValues[1]);
      if(vertexValues.length > 2)
        vertexNormalIndex = parseInt(vertexValues[2]);
      
      if (vertexIndex == 0)
        throw "Faces uses invalid vertex index of 0";

      // Negative vertex indices refer to the nth last defined vertex
      // convert these to postive indices for simplicity
      if (vertexIndex < 0)
        vertexIndex = this._currentModel().vertices.length + 1 + vertexIndex;

      polygon.addVertex(vertexIndex, textureCoordsIndex, vertexNormalIndex);
    }
    this._currentModel().addPolygon(polygon);
  }

  _parseMtlLib(lineItems) {
    if(lineItems.length >= 2)
      this.materialLibs.push(lineItems[1]);
  }

  _parseUseMtl(lineItems) {
    if(lineItems.length >= 2)
      this.currentMaterial = lineItems[1];
  }

  _parseSmoothShadingStatement(lineItems) {
    throw "NOT IMPLEMENTED";
  }
}

module.exports = OBJFile;