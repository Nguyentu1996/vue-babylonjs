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
  DirectionalLight,
  ShadowGenerator,
} from "@babylonjs/core";

export class ArtTextureDemo {
  scene: Scene;
  engine: Engine;
  shadowGenerator!: ShadowGenerator;
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
    const hemiLight = new DirectionalLight(
      "hemiLight",
      new Vector3(-1, -2, -1),
      this.scene
    );
    hemiLight.position = new Vector3(20, 40, 20);
    hemiLight.intensity = 0.5;
    this.shadowGenerator = new ShadowGenerator(1024, hemiLight);

    // const light = new DirectionalLight(
    //   "DirectionalLight",
    //   new Vector3(0, -1, 0),
    //   scene
    // );

    // hemiLight.diffuse = new Color3(15, 15, 15);

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
    groundMat.specularColor = new Color3(0, 0, 0);
    // const groundTexture = new Texture("./textures/floor/Floor_DIF.jpg");
    // groundMat.diffuseTexture = groundTexture;
    // groundTexture.uScale = 4;
    // groundTexture.vScale = 4;
    ground.material = groundMat;
    console.log("mess", ground);
    ground.checkCollisions = true;
    ground.isPickable = false;
    ground.receiveShadows = true;

    return ground;
  }
  buildWall(width = 20, height = 10, depth = 0.5): Mesh[] {
    const wallMat = new StandardMaterial("wallMat", this.scene);
    // const wallTexture = new Texture("./textures/wall/Wall.jpg");
    // wallMat.diffuseTexture = wallTexture;
    wallMat.diffuseColor = new Color3(247 / 255, 247 / 255, 247 / 255);
    // wallMat.ambientColor = new Color3(247 / 255, 247 / 255, 247 / 255);
    wallMat.emissiveColor = new Color3(79 / 255, 76 / 255, 76 / 255);
    // groundMat.diffuseColor = new Color3(237 / 255, 236 / 255, 235 / 255);

    const wall = MeshBuilder.CreateBox(
      "wall",
      { width: 20, height: 10, depth: depth },
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
      const boundaryNum = 1.5;
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
      this.shadowGenerator?.getShadowMap()?.renderList?.push(walls[i]);
    }
    walls.push(wall);
    this.shadowGenerator?.getShadowMap()?.renderList?.push(wall);
    this.shadowGenerator.addShadowCaster(wall);
    // this.shadowGenerator.useExponentialShadowMap = true;
    return walls;
  }
  buildArt() {
    // TODO
    const art = MeshBuilder.CreateBox("art", {
      width: 1.325,
      height: 2,
      depth: 0.03,
    });
    const artMat = new StandardMaterial("artMat", this.scene);
    artMat.emissiveColor = Color3.White();
    art.material = artMat;
    const image = MeshBuilder.CreatePlane("img", { width: 1.325, height: 2 });
    const imgMat = new StandardMaterial("imgMat", this.scene);
    const imgTexture = new Texture("./textures/artworks/art1.jpeg", this.scene);

    imgMat.diffuseTexture = imgTexture;
    imgMat.emissiveColor = Color3.White();
    image.material = imgMat;
    image.translate(new Vector3(0, 0, -0.03), 1);
    const group = new TransformNode(`artwork`);
    image.parent = group;
    art.parent = group;
    group.position = new Vector3(0, 2, 9.5);
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
