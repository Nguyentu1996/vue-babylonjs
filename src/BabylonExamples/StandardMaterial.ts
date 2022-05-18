import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";

export class StandardMaterialExample {
  scene: Scene;
  engine: Engine;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene);
    camera.attachControl();
    camera.speed = 0.25;
    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );
    hemiLight.intensity = 1;
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this.scene
    );
    const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, this.scene);
    ball.position = new Vector3(0, 1, 0);
    ground.material = this.CreateGroundMaterial();
    ball.material = this.CreateBallMaterial();
    return scene;
  }
  CreateGroundMaterial(): StandardMaterial {
    const groundMat = new StandardMaterial("groundMat", this.scene);
    const uvScale = 4;
    const texArray: Texture[] = [];
    const diffuseTex = new Texture(
      "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/cobblestone_floor_05/cobblestone_floor_05_diff_4k.jpg",
      this.scene
    );
    groundMat.diffuseTexture = diffuseTex;
    texArray.push(diffuseTex);
    const normalTex = new Texture(
      "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/cobblestone_floor_05/cobblestone_floor_05_nor_gl_4k.jpg",
      this.scene
    );
    groundMat.bumpTexture = normalTex;
    texArray.push(normalTex);
    const ambientTexture = new Texture(
      "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/cobblestone_floor_05/cobblestone_floor_05_ao_4k.jpg",
      this.scene
    );
    groundMat.ambientTexture = ambientTexture;
    texArray.push(ambientTexture);

    const specTex = new Texture(
      "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/cobblestone_floor_05/cobblestone_floor_05_spec_4k.jpg",
      this.scene
    );
    groundMat.specularTexture = specTex;
    texArray.push(specTex);
    texArray.forEach((tex) => {
      tex.uScale = uvScale;
      tex.vScale = uvScale;
    });
    return groundMat;
  }
  CreateBallMaterial(): StandardMaterial {
    const ballMat = new StandardMaterial("ballMat", this.scene);
    const uvScale = 1;
    const texArray: Texture[] = [];
    const diffuseTex = new Texture(
      "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/metal_plate/metal_plate_diff_4k.jpg",
      this.scene
    );
    ballMat.diffuseTexture = diffuseTex;
    texArray.push(diffuseTex);
    const normalTex = new Texture(
      "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/metal_plate/metal_plate_nor_gl_4k.jpg",
      this.scene
    );
    ballMat.bumpTexture = normalTex;
    texArray.push(normalTex);
    const ambientTexture = new Texture(
      "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/metal_plate/metal_plate_ao_4k.jpg",
      this.scene
    );
    ballMat.ambientTexture = ambientTexture;
    texArray.push(ambientTexture);

    const specTex = new Texture(
      "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/metal_plate/metal_plate_spec_4k.jpg",
      this.scene
    );
    ballMat.specularTexture = specTex;
    ballMat.invertNormalMapX = true;
    ballMat.invertNormalMapY = true;
    ballMat.specularPower = 1;
    texArray.push(specTex);
    texArray.forEach((tex) => {
      tex.uScale = uvScale;
      tex.vScale = uvScale;
    });
    return ballMat;
  }
}
