'use strict';

const OBJFile = require('../src/OBJFile.js');

describe('OBJ File Parser', () => {

  describe('Comments', () => {

    it('strips everthing from the # to the end of the line', () => {
      const line = "abc#def";
      expect(new OBJFile()._stripComments(line)).toBe('abc');
    });

  });

  describe('Vertex Definition', () => {

    it('v statements define a vertex', () => {
      var fileContents = "v 1.0 2.0 3.0\nv 4.0 5.5 6.0"
      var model = new OBJFile(fileContents).parse().models[0];
      expect(model.vertices.length).toBe(2);
      expect(model.vertices[0]).toEqual({x: 1.0, y: 2.0, z: 3.0 });
      expect(model.vertices[1]).toEqual({x: 4.0, y: 5.5, z: 6.0 });  
    });

  });

  describe('Texture Coord Definition', () => {

    it('vt statements define a texture coords', () => {
      var fileContents = "vt 1.0 2.0 3.0\nvt 4.0 5.5 6.0"
      var model = new OBJFile(fileContents).parse().models[0];
      expect(model.textureCoords.length).toBe(2);
      expect(model.textureCoords[0]).toEqual({u: 1.0, v: 2.0, w: 3.0 });
      expect(model.textureCoords[1]).toEqual({u: 4.0, v: 5.5, w: 6.0 });  
    });

  });

  describe('Vertex Normal Definition', () => {

    it('vn statements define vertex normals', () => {
      var fileContents = "vn 1.0 2.0 3.0\nvn 4.0 5.5 6.0";
      var model = new OBJFile(fileContents).parse().models[0];
      expect(model.vertexNormals.length).toBe(2);
      expect(model.vertexNormals[0]).toEqual({x: 1.0, y: 2.0, z: 3.0 });
      expect(model.vertexNormals[1]).toEqual({x: 4.0, y: 5.5, z: 6.0 });  
    });

  });

  describe('Polygon Definition', () => {

    it('f statements throw an error if given less than 3 vertices', () => {
      var fileContents = "f 1 2";
      expect(new OBJFile(fileContents).parse).toThrow();
    });

    it('f statements with single values define a face with the given vertex indices', () => {
      var fileContents = "f 1 2 3";
      var model = new OBJFile(fileContents).parse().models[0];  
      expect(model.faces.length).toBe(1);
      expect(model.faces[0].vertices).toEqual([
        { vertexIndex: 1, textureCoordsIndex: 0, normalIndex: 0 },
        { vertexIndex: 2, textureCoordsIndex: 0, normalIndex: 0 },
        { vertexIndex: 3, textureCoordsIndex: 0, normalIndex: 0 }
      ]);
    });

    it('f statements with double values define a face with the given vertex indices / texture Coords', () => {
      var fileContents = "f 1/4 2/5 3/6";
      var model = new OBJFile(fileContents).parse().models[0];  
      expect(model.faces.length).toBe(1);
      expect(model.faces[0].vertices).toEqual([
        { vertexIndex: 1, textureCoordsIndex: 4, normalIndex: 0 },
        { vertexIndex: 2, textureCoordsIndex: 5, normalIndex: 0 },
        { vertexIndex: 3, textureCoordsIndex: 6, normalIndex: 0 }
      ]);
    });

    it('f statements with triple values define a face with the given vertex indices / texture Coords / vertex normals', () => {
      var fileContents = "f 1/4/7 2/5/8 3/6/9";
      var model = new OBJFile(fileContents).parse().models[0];  
      expect(model.faces.length).toBe(1);
      expect(model.faces[0].vertices).toEqual([
        { vertexIndex: 1, textureCoordsIndex: 4, normalIndex: 7 },
        { vertexIndex: 2, textureCoordsIndex: 5, normalIndex: 8 },
        { vertexIndex: 3, textureCoordsIndex: 6, normalIndex: 9 }
      ]);
    });

    it('f statements may omit texture coord indices', () => {
      var fileContents = "f 1//7 2//8 3//9";
      var model = new OBJFile(fileContents).parse().models[0];  
      expect(model.faces.length).toBe(1);
      expect(model.faces[0].vertices).toEqual([
        { vertexIndex: 1, textureCoordsIndex: 0, normalIndex: 7 },
        { vertexIndex: 2, textureCoordsIndex: 0, normalIndex: 8 },
        { vertexIndex: 3, textureCoordsIndex: 0, normalIndex: 9 }
      ]);
    });

  });

  describe('Materials', () => {

    it('returns a list of referenced material libraries', () => {
      var fileContents = "mtllib lib1\nmtllib lib2";
      var materialLibs = new OBJFile(fileContents).parse().materialLibs;
      expect(materialLibs).toEqual(['lib1', 'lib2']);  
    });

  });
});