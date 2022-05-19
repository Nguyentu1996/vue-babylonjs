import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  Sound,
  StandardMaterial,
  Texture,
  Vector3,
  Vector4,
} from "@babylonjs/core";

export class Village {
  scene: Scene;
  engine: Engine;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = this.createScene();
    this.buildDwelling();
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  createScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      new Vector3(0, 0, 0)
    );
    camera.attachControl(this.canvas);
    const light = new HemisphericLight(
      "light",
      new Vector3(1, 1, 0),
      this.scene
    );
    return scene;
  }
  buildDwelling() {
    const ground = this.buildGround();
    const detached_house = this.buildHouse(1);
    const semi_house = this.buildHouse(2);

    if (detached_house === null || semi_house === null) {
      return;
    }
    detached_house.rotation.y = -Math.PI / 16;
    detached_house.position.x = -6.8;
    detached_house.position.z = 2.5;
    semi_house.rotation.y = -Math.PI / 16;
    semi_house.position.x = -4.5;
    semi_house.position.z = 3;

    const places: any = []; //each entry is an array [house type, rotation, x, z]
    places.push([1, -Math.PI / 16, -6.8, 2.5]);
    places.push([2, -Math.PI / 16, -4.5, 3]);
    places.push([2, -Math.PI / 16, -1.5, 4]);
    places.push([2, -Math.PI / 3, 1.5, 6]);
    places.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
    places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
    places.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
    places.push([1, (5 * Math.PI) / 4, 0, -1]);
    places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
    places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
    places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
    places.push([2, Math.PI / 1.9, 4.75, -1]);
    places.push([1, Math.PI / 1.95, 4.5, -3]);
    places.push([2, Math.PI / 1.9, 4.75, -5]);
    places.push([1, Math.PI / 1.9, 4.75, -7]);
    places.push([2, -Math.PI / 3, 5.25, 2]);
    places.push([1, -Math.PI / 3, 6, 4]);
    //Create instances from the first two that were built
    if (places.length < 1) return;
    const houses = [];
    for (let i = 0; i < places.length; i++) {
      if (places[i][0] === 1) {
        houses[i] = detached_house.createInstance("house" + i);
      } else {
        houses[i] = semi_house.createInstance("house" + i);
      }
      houses[i].rotation.y = places[i][1];
      houses[i].position.x = places[i][2];
      houses[i].position.z = places[i][3];
    }
  }
  buildHouse(width: number) {
    const box = this.buildBox(width);
    const roof = this.buildRoof(width);
    const house = Mesh.MergeMeshes(
      [box, roof],
      true,
      false,
      undefined,
      false,
      true
    );
    return house;
  }
  buildGround() {
    const ground = MeshBuilder.CreateGround("ground", {
      width: 15,
      height: 16,
    });
    const groundMat = new StandardMaterial("groundMat");
    groundMat.diffuseColor = new Color3(0, 1, 0);
    ground.material = groundMat;
    return ground;
  }
  buildBox(width: number) {
    const boxMat = new StandardMaterial("boxMat");
    if (width == 2) {
      boxMat.diffuseTexture = new Texture(
        "https://assets.babylonjs.com/environments/semihouse.png"
      );
    } else {
      boxMat.diffuseTexture = new Texture(
        "https://assets.babylonjs.com/environments/cubehouse.png"
      );
    }
    const faceUV = [];
    if (width == 2) {
      //options parameter to set different images on each side
      faceUV[0] = new Vector4(0.6, 0.0, 1, 1.0); //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
      faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
      faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
      // top 4 and bottom 5 not seen so not set
    } else {
      faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
      faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
      faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
    }
    const box = MeshBuilder.CreateBox("box", {
      width: width,
      faceUV: faceUV,
      wrap: true,
    });
    box.position.y = 0.5;
    box.material = boxMat;
    return box;
  }
  buildRoof(width: number) {
    const roof = MeshBuilder.CreateCylinder("roof", {
      height: 1.2,
      tessellation: 3,
      diameter: 1.3,
    });
    roof.position.y = 1.22;
    roof.rotation.z = Math.PI / 2;
    roof.scaling.x = 0.75;
    roof.scaling.y = width;

    const roofMat = new StandardMaterial("roofMat");
    roofMat.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/roof.jpg"
    );
    roof.material = roofMat;
    return roof;
  }
  // createTexture() {
  // }
}
