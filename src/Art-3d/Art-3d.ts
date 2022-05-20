import {
  Scene,
  Engine,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  UniversalCamera,
  StandardMaterial,
  Texture,
  Mesh,
} from "@babylonjs/core";

export class ArtDemo {
  scene: Scene;
  engine: Engine;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.createRoom();
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    scene.gravity = new Vector3(0, -0.9, 0);
    const camera = new UniversalCamera(
      "camera",
      new Vector3(0, 2, 1),
      this.scene
    );
    camera.speed = 0.25;
    camera.applyGravity = true;
    camera.checkCollisions = true;

    camera.attachControl();
    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 10, -1),
      this.scene
    );
    // hemiLight.intensity = 0.7;
    return scene;
  }
  createRoom() {
    this.buildGround();
    const wall = this.buildWall();
  }
  buildGround(): Mesh {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 20, height: 20 },
      this.scene
    );
    const groundMat = new StandardMaterial("groundMat", this.scene);
    const groundTexture = new Texture("./textures/floor/Floor_DIF.jpg");
    groundMat.diffuseTexture = groundTexture;
    groundTexture.uScale = 4;
    groundTexture.vScale = 4;
    ground.material = groundMat;
    ground.checkCollisions = true;
    ground.isPickable = false;
    return ground;
  }
  buildWall() {
    const wallMat = new StandardMaterial("wallMat", this.scene);
    const wallTexture = new Texture("./textures/wall/Wall.jpg");
    wallMat.diffuseTexture = wallTexture;
    const wall = MeshBuilder.CreatePlane(
      "wall",
      { width: 20, height: 10 },
      this.scene
    );
    wall.material = wallMat;
    wall.position = new Vector3(0, 0, 10);
    wall.checkCollisions = true;
    //finally, say which mesh will be collisionable
    const places = [];
    // places.push([0, 0, 10, 0]); // front
    places.push([0, 0, -10, Math.PI, 1]); // back
    places.push([10, 0, 0, Math.PI / 2, -1]); // right
    places.push([-10, 0, 0, -Math.PI / 2, 1]); // left
    const walls = [];
    for (let i = 0; i < places.length; i++) {
      walls[i] = wall.createInstance("wall" + i);
      const x = places[i][0];
      const y = places[i][1];
      const z = places[i][2];
      const rotationY = places[i][3];
      walls[i].position = new Vector3(x, y, z);
      walls[i].rotation.y = rotationY;
      walls[i].checkCollisions = true;
      // walls[i].showBoundingBox = true;
      // const boundary = walls[i].clone("boundary" + i);
      // // boundary.position
      // boundary.isVisible = false;
    }
    return wall;
  }
}
