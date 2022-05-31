import {
  ArcRotateCamera,
  DirectionalLight,
  Engine,
  Mesh,
  Scene,
  Vector3,
  VertexData,
} from "@babylonjs/core";

export class House {
  scene: Scene;
  engine: Engine;
  baseData = [-5, 0, 5, 0, 5, 6, 2, 6, 2, 9, -5, 9];
  corners: Corner[] = [];
  walls: Wall[] = [];
  ply = 0.3;
  height = 5;
  // positions: any[] = [];
  // indices: any[] = [];
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas);
    this.scene = new Scene(this.engine);
    this.initCamera();
    this.initLight();
    this.buildCorners();
    this.buildWall();
    this.buildFromPlan(this.walls);
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  buildCorners() {
    this.corners = [];
    for (let i = 0; i < this.baseData.length / 2; i++) {
      this.corners.push(
        new Corner(this.baseData[2 * i], this.baseData[2 * i + 1])
      );
    }
  }
  buildWall() {
    this.walls = [];
    for (let i = 0; i < this.corners.length; i++) {
      this.walls.push(new Wall(this.corners[i].corner));
    }
  }

  buildFromPlan(walls: Wall[]) {
    const outerData = [];
    let angle = 0;
    let direction = 0;
    let line = Vector3.Zero();
    // subtract vector a - b = a + (-b)
    walls[1].corner.subtractToRef(walls[0].corner, line);

    const nextLine = Vector3.Zero();
    walls[2].corner.subtractToRef(walls[1].corner, nextLine);
    const nbWalls = walls.length;
    for (let i = 0; i <= nbWalls; i++) {
      // return angle 0 > Pi,
      angle = Math.acos(
        Vector3.Dot(line, nextLine) / (line.length() * nextLine.length())
      );
      // Tổng hai vectơ cạnh chung điểm đầu của một hình bình hành bằng vectơ đường chéo
      direction = Vector3.Cross(nextLine, line).normalize().y;
      const lineNormal = new Vector3(line.z, 0, -1 * line.x).normalize();
      line.normalize();
      outerData[(i + 1) % nbWalls] = walls[(i + 1) % nbWalls].corner
        .add(lineNormal.scale(this.ply))
        .add(line.scale((direction * this.ply) / Math.tan(angle / 2)));
      line = nextLine.clone();
      walls[(i + 3) % nbWalls].corner.subtractToRef(
        walls[(i + 2) % nbWalls].corner,
        nextLine
      );
    }
    const positions = [];
    const indices = [];
    for (let i = 0; i < nbWalls; i++) {
      positions.push(walls[i].corner.x, walls[i].corner.y, walls[i].corner.z); // inner corners base
    }
    for (let i = 0; i < nbWalls; i++) {
      positions.push(outerData[i].x, outerData[i].y, outerData[i].z); // outer corners base
    }
    for (let w = 0; w < nbWalls; w++) {
      indices.push(
        w,
        (w + 1) % nbWalls,
        nbWalls + ((w + 1) % nbWalls),
        w,
        nbWalls + ((w + 1) % nbWalls),
        w + nbWalls
      ); // base indices
    }
    const currentLength = positions.length; // inner and outer top corners
    for (let w = 0; w < currentLength / 3; w++) {
      positions.push(positions[3 * w]);
      positions.push(this.height);
      positions.push(positions[3 * w + 2]);
    }

    for (let i = 0; i < currentLength / 3; i++) {
      indices.push(
        indices[3 * i + 2] + 2 * nbWalls,
        indices[3 * i + 1] + 2 * nbWalls,
        indices[3 * i] + 2 * nbWalls
      ); // top indices
    }
    for (let w = 0; w < nbWalls; w++) {
      indices.push(
        w,
        w + 2 * nbWalls,
        ((w + 1) % nbWalls) + 2 * nbWalls,
        w,
        ((w + 1) % nbWalls) + 2 * nbWalls,
        (w + 1) % nbWalls
      ); // inner wall indices
      indices.push(
        ((w + 1) % nbWalls) + 3 * nbWalls,
        w + 3 * nbWalls,
        w + nbWalls,
        ((w + 1) % nbWalls) + nbWalls,
        ((w + 1) % nbWalls) + 3 * nbWalls,
        w + nbWalls
      ); // outer wall indices
    }
    const normals: any[] = [];
    const uvs: any = [];
    debugger;
    VertexData.ComputeNormals(positions, indices, normals);
    VertexData._ComputeSides(Mesh.FRONTSIDE, positions, indices, normals, uvs);
    //Create a custom mesh
    const customMesh = new Mesh("custom", this.scene);

    //Create a vertexData object
    const vertexData = new VertexData();
    //Assign positions and indices to vertexData
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    //Apply vertexData to custom mesh
    vertexData.applyToMesh(customMesh);
    return customMesh;
  }

  initCamera() {
    // TODO
    const camera = new ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 3,
      25,
      new Vector3(0, 0, 4.5),
      this.scene
    );
    camera.attachControl(this.canvas, true);
    debugger;
  }
  initLight() {
    // TODO
    const light = new DirectionalLight(
      "light",
      new Vector3(-1, -2, -1),
      this.scene
    );
  }
  initGround() {
    // TODO
  }
}
export class Wall {
  corner: Vector3;
  constructor(corner: Vector3) {
    this.corner = corner;
  }
}
export class Corner {
  corner: Vector3;
  constructor(x: number, y: number) {
    this.corner = new Vector3(x, 0, y);
  }
}
