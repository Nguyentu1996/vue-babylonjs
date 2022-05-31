import {
  AbstractMesh,
  ArcRotateCamera,
  CubeTexture,
  Engine,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

export class CameraMechanics {
  engine: Engine;
  scene!: Scene;
  watch!: AbstractMesh;
  camera!: ArcRotateCamera;
  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = this.createScene();
    this.engine.displayLoadingUI();
    this.createCamera();
    this.createWatch();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  createScene(): Scene {
    const scene = new Scene(this.engine);
    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/xmas_bg.env",
      scene
    );
    envTex.gammaSpace = false;

    envTex.rotationY = Math.PI;

    scene.environmentTexture = envTex;
    scene.createDefaultSkybox(envTex, true, 1000, 0.25);

    return scene;
  }
  createCamera(): void {
    this.camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2,
      40,
      Vector3.Zero(),
      this.scene
    );

    this.camera.attachControl(this.canvas, true);
    this.camera.wheelPrecision = 100;

    this.camera.minZ = 0.3;

    this.camera.lowerRadiusLimit = 1;
    this.camera.upperRadiusLimit = 5;

    this.camera.panningSensibility = 0;

    //this.camera.useBouncingBehavior = true;
    this.camera.useAutoRotationBehavior = true;
    // this.camera.autoRotationBehavior.idleRotationSpeed = 0.5;
    // this.camera?.autoRotationBehavior?.idleRotationSpinupTime = 1000;
    // this.camera?.autoRotationBehavior?.idleRotationWaitTime = 2000;
    // this.camera?.autoRotationBehavior?.zoomStopsAnimation = true;
    this.camera.useFramingBehavior = true;
  }
  async createWatch(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "vintage_watch.glb",
      this.scene
    );
    this.watch = meshes[0];
    this.camera.setTarget(meshes[2]);
    this.engine.hideLoadingUI();
  }
}
