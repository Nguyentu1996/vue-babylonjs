import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  CubeTexture,
  PBRMaterial,
  Texture,
  SceneLoader,
  MeshBuilder,
} from "@babylonjs/core";
import "@babylonjs/loaders";
export class CustomModels {
  scene: Scene;
  engine: Engine;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.CreateGround();
    this.CreateBarrel();
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
    hemiLight.intensity = 0.5;

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/sky.env",
      scene
    );
    scene.environmentTexture = envTex;
    scene.environmentIntensity = 0.5;
    scene.createDefaultSkybox(envTex, true);

    return scene;
  }
  CreateGround(): void {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this.scene
    );
    // const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, this.scene);
    // ball.position = new Vector3(0, 1, 0);
    ground.material = this.CreateAsphalt();
    // ball.material = this.CreateMagic();
  }
  CreateAsphalt(): PBRMaterial {
    const pbr = new PBRMaterial("pbr", this.scene);
    pbr.albedoTexture = new Texture(
      "./textures/asphalt/asphalt_02_diff.jpeg",
      this.scene
    );
    pbr.bumpTexture = new Texture(
      "./textures/asphalt/asphalt_02_nor_gl.jpeg",
      this.scene
    );
    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;
    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;
    pbr.metallicTexture = new Texture(
      "./textures/asphalt/asphalt_02_arm.jpeg",
      this.scene
    );
    // pbr.roughness = 1;
    return pbr;
  }
  CreateBarrel(): void {
    SceneLoader.ImportMesh(
      "",
      "./models/",
      "Barrel.glb",
      this.scene,
      (meshes) => {
        console.log("mess", meshes);
      }
    );
  }
}
