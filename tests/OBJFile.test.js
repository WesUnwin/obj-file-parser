'use strict';

const OBJFile = require('../src/OBJFile');

describe('OBJ File Parser', () => {
  describe('Object Name', () => {
    it('assigns objects the default name "untitled" if no object name was declared', () => {
      const fileContents = "v 1.0 2.0 3.0";
      const modelName = new OBJFile(fileContents).parse().models[0].name;
      expect(modelName).toBe('untitled');
    });

    it('assigns objects the name specified by the o statement', () => {
      const fileContents = "o cube";
      const modelName = new OBJFile(fileContents).parse().models[0].name;
      expect(modelName).toBe('cube');
    });
  });

  describe('Comments', () => {
    it('ignores the remainders of a line after #', () => {
      const fileContents = "o cube#This is an inline comment";
      const modelName = new OBJFile(fileContents).parse().models[0].name;
      expect(modelName).toBe('cube');
    });

    it('ignores lines containing just a comment', () => {
      const fileContents = "v 1.0 2.0 3.0\n# LINE COMMENT\nv 4.0 5.5 6.0";
      const model = new OBJFile(fileContents).parse().models[0];
      expect(model.vertices.length).toBe(2);
    });
  });

  describe('Blank lines', () => {
    it('ignores blank lines', () => {
      const fileContents = "v 1.0 2.0 3.0\n    \nv 4.0 5.5 6.0";
      const model = new OBJFile(fileContents).parse().models[0];
      expect(model.vertices.length).toBe(2);
    });
  });

  describe('Vertex Definition', () => {
    it('v statements define a vertex', () => {
      const fileContents = "v 1.0 2.0 3.0\nv 4.0 5.5 6.0"
      const model = new OBJFile(fileContents).parse().models[0];
      expect(model.vertices.length).toBe(2);
      expect(model.vertices[0]).toEqual({x: 1.0, y: 2.0, z: 3.0 });
      expect(model.vertices[1]).toEqual({x: 4.0, y: 5.5, z: 6.0 });  
    });
  });

  describe('Texture Coord Definition', () => {
    it('vt statements define a texture coords', () => {
      const fileContents = "vt 1.0 2.0 3.0\nvt 4.0 5.5 6.0";
      const model = new OBJFile(fileContents).parse().models[0];
      expect(model.textureCoords.length).toBe(2);
      expect(model.textureCoords[0]).toEqual({u: 1.0, v: 2.0, w: 3.0 });
      expect(model.textureCoords[1]).toEqual({u: 4.0, v: 5.5, w: 6.0 });  
    });
  });

  describe('Vertex Normal Definition', () => {
    it('vn statements define vertex normals', () => {
      const fileContents = "vn 1.0 2.0 3.0\nvn 4.0 5.5 6.0";
      const model = new OBJFile(fileContents).parse().models[0];
      expect(model.vertexNormals.length).toBe(2);
      expect(model.vertexNormals[0]).toEqual({x: 1.0, y: 2.0, z: 3.0 });
      expect(model.vertexNormals[1]).toEqual({x: 4.0, y: 5.5, z: 6.0 });  
    });
  });

  describe('Polygon Definition', () => {
    it('f statements throw an error if given less than 3 vertices', () => {
      const fileContents = "f 1 2";
      expect(new OBJFile(fileContents).parse).toThrow();
    });

    it('f statements with single values define a face with the given vertex indices', () => {
      const fileContents = "f 1 2 3";
      const model = new OBJFile(fileContents).parse().models[0];  
      expect(model.faces.length).toBe(1);
      expect(model.faces[0].vertices).toEqual([
        { vertexIndex: 1, textureCoordsIndex: 0, vertexNormalIndex: 0 },
        { vertexIndex: 2, textureCoordsIndex: 0, vertexNormalIndex: 0 },
        { vertexIndex: 3, textureCoordsIndex: 0, vertexNormalIndex: 0 }
      ]);
    });

    it('f statements with double values define a face with the given vertex indices / texture Coords', () => {
      const fileContents = "f 1/4 2/5 3/6";
      const model = new OBJFile(fileContents).parse().models[0];  
      expect(model.faces.length).toBe(1);
      expect(model.faces[0].vertices).toEqual([
        { vertexIndex: 1, textureCoordsIndex: 4, vertexNormalIndex: 0 },
        { vertexIndex: 2, textureCoordsIndex: 5, vertexNormalIndex: 0 },
        { vertexIndex: 3, textureCoordsIndex: 6, vertexNormalIndex: 0 }
      ]);
    });

    it('f statements with triple values define a face with the given vertex indices / texture Coords / vertex normals', () => {
      const fileContents = "f 1/4/7 2/5/8 3/6/9";
      const model = new OBJFile(fileContents).parse().models[0];  
      expect(model.faces.length).toBe(1);
      expect(model.faces[0].vertices).toEqual([
        { vertexIndex: 1, textureCoordsIndex: 4, vertexNormalIndex: 7 },
        { vertexIndex: 2, textureCoordsIndex: 5, vertexNormalIndex: 8 },
        { vertexIndex: 3, textureCoordsIndex: 6, vertexNormalIndex: 9 }
      ]);
    });

    it('f statements may omit texture coord indices', () => {
      const fileContents = "f 1//7 2//8 3//9";
      const model = new OBJFile(fileContents).parse().models[0];  
      expect(model.faces.length).toBe(1);
      expect(model.faces[0].vertices).toEqual([
        { vertexIndex: 1, textureCoordsIndex: 0, vertexNormalIndex: 7 },
        { vertexIndex: 2, textureCoordsIndex: 0, vertexNormalIndex: 8 },
        { vertexIndex: 3, textureCoordsIndex: 0, vertexNormalIndex: 9 }
      ]);
    });
  });

  describe('Materials', () => {
    it('returns a list of referenced material libraries', () => {
      var fileContents = "mtllib lib1\nmtllib lib2";
      var materialLibs = new OBJFile(fileContents).parse().materialLibraries;
      expect(materialLibs).toEqual(['lib1', 'lib2']);  
    });
  });

  describe('Groups', () => {
    it('assigns each face to a group called "" by default', () => {
      const fileContents = "f 1 2 3";
      const model = new OBJFile(fileContents).parse().models[0];
      expect(model.faces[0].group).toBe('');
    });

    it('assigns each face to the group indicated by the preceding g statement', () => {
      const fileContents = "g group1\nf 1 2 3";
      const model = new OBJFile(fileContents).parse().models[0];
      expect(model.faces[0].group).toBe('group1');
    });

    it('resets the current group to "" when starting a new object', () => {
      const fileContents = "g group1\nf 1 2 3\no newObj\nf 1 2 3";
      const model = new OBJFile(fileContents).parse().models[1];
      expect(model.faces[0].group).toBe('');
    });
  });

  describe('Smoothing Groups', () => {
    it('assigns each face to a smoothing group 0 (no smoothing) by default', () => {
      const fileContents = "f 1 2 3";
      const model = new OBJFile(fileContents).parse().models[0];
      expect(model.faces[0].smoothingGroup).toBe(0);
    });

    it('assigns each face to the smoothing group indicated by the preceding s statement', () => {
      const fileContents = "s 123\nf 1 2 3";
      const model = new OBJFile(fileContents).parse().models[0];
      expect(model.faces[0].smoothingGroup).toBe(123);
    });

    it('resets the current smoothing group to 0 when starting a new object', () => {
      const fileContents = "s 2\nf 1 2 3\no newObj\nf 1 2 3";
      const model = new OBJFile(fileContents).parse().models[1];
      expect(model.faces[0].smoothingGroup).toBe(0);
    });

    it('resets the current smoothing group to 0 after an "s off" statement', () => {
      const fileContents = "s 2\nf 1 2 3\ns off\nf 1 2 3";
      const model = new OBJFile(fileContents).parse().models[0];
      expect(model.faces[1].smoothingGroup).toBe(0);
    });
  });
});
