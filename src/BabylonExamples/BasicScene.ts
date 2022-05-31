import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";

export class BasicScene {
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
    new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
    MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, this.scene);
    MeshBuilder.CreateSphere("ball", { diameter: 1 }, this.scene);
    return scene;
  }
}
