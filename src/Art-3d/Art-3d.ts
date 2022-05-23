import { ArtList, Rotation } from "@/modal/art-list";
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
  Color3,
  TransformNode,
  Color4,
} from "@babylonjs/core";

export class ArtDemo {
  scene: Scene;
  engine: Engine;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.createScene();
    this.createRoom();
    this.buildArt();
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  createScene(): Scene {
    const scene = new Scene(this.engine);
    scene.clearColor = new Color4(255, 255, 255, 1);
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
    hemiLight.diffuse = new Color3(15, 15, 15);

    // hemiLight.intensity = 0.7;
    return scene;
  }
  createRoom() {
    this.buildGround();
    this.buildWall();
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
  buildWall(): void {
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
    const boundary = wall.clone("boundary");
    boundary.position.z -= 1;
    boundary.isVisible = false;
    //finally, say which mesh will be collisionable
    const places = [];
    // places.push([0, 0, 10]); // front
    places.push([0, 0, -10, Rotation.BACK]); // back
    places.push([10, 0, 0, Rotation.RIGHT]); // right
    places.push([-10, 0, 0, Rotation.LEFT]); // left
    const walls = [];
    for (let i = 0; i < places.length; i++) {
      walls[i] = wall.clone("wall" + i);
      const x = places[i][0];
      const y = places[i][1];
      const z = places[i][2];
      const rotationY = places[i][3];
      walls[i].position = new Vector3(x, y, z);
      walls[i].rotation.y = rotationY;
      const boundary = walls[i].clone("boundary" + i);
      const boundaryNum = 1;
      boundary.isVisible = false;

      if (x !== 0) {
        if (x > 0) {
          boundary.position.x -= boundaryNum;
        } else {
          boundary.position.x += boundaryNum;
        }
      } else {
        boundary.position.z += boundaryNum;
      }
    }
  }
  buildArt() {
    // TODO
    const art = MeshBuilder.CreateBox("art", {
      width: 1.325,
      height: 2,
      depth: 0.02,
    });
    const artMat = new StandardMaterial("artMat", this.scene);
    artMat.diffuseColor = Color3.Black();
    art.material = artMat;
    const image = MeshBuilder.CreatePlane("img", { width: 1.325, height: 2 });
    const imgMat = new StandardMaterial("imgMat", this.scene);
    const imgTexture = new Texture("./textures/artworks/art1.jpeg", this.scene);

    imgMat.diffuseTexture = imgTexture;
    image.material = imgMat;
    image.translate(new Vector3(0, 0, -0.02), 1);
    const group = new TransformNode(`artwork`);
    image.parent = group;
    art.parent = group;
    group.position = new Vector3(0, 2, 10);
    console.log("group", group.getChildTransformNodes());
    const artList: ArtList[] = [
      {
        imgUrl: "./textures/artworks/art1.jpeg",
        height: 2,
        width: 1.325,
        position: [],
      },
      {
        imgUrl: "./textures/artworks/art2.jpeg",
        height: 2,
        width: 1.325,
        position: [],
      },
      {
        imgUrl: "./textures/artworks/art3.jpeg",
        height: 2,
        width: 1.325,
        position: [],
      },
      {
        imgUrl: "./textures/artworks/art4.jpeg",
        height: 2,
        width: 1.325,
        position: [],
      },
    ];
    // for (let i = 0; i < artList.length; i++) {
    //   //
    //   const groupNew = new TransformNode(`artwork${i}`);

    //   const groupClone = group.clone(`"art" + ${i}`, groupNew, true);
    // }
  }
}
