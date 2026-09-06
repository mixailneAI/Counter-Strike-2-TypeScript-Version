import { Scene, Vector3, MeshBuilder, StandardMaterial, Color3, HemisphericLight } from '@babylonjs/core';
import * as CANNON from 'cannon-es';

export class MapSystem {
  private scene: Scene;
  private world: CANNON.World | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  async createMap() {
    this.createGround();
    this.createWalls();
    this.createCover();
    this.createSkybox();
  }

  private createGround() {
    const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, this.scene);
    const groundMat = new StandardMaterial('groundMat', this.scene);
    groundMat.diffuseColor = new Color3(0.6, 0.5, 0.3);
    ground.material = groundMat;
  }

  private createWalls() {
    const wallMat = new StandardMaterial('wallMat', this.scene);
    wallMat.diffuseColor = new Color3(0.7, 0.6, 0.4);

    const walls = [
      { width: 100, height: 10, depth: 1, pos: new Vector3(0, 5, -50) },
      { width: 100, height: 10, depth: 1, pos: new Vector3(0, 5, 50) },
      { width: 1, height: 10, depth: 100, pos: new Vector3(-50, 5, 0) },
      { width: 1, height: 10, depth: 100, pos: new Vector3(50, 5, 0) },
    ];

    walls.forEach((wall, index) => {
      const mesh = MeshBuilder.CreateBox(`wall_${index}`, { width: wall.width, height: wall.height, depth: wall.depth }, this.scene);
      mesh.position = wall.pos;
      mesh.material = wallMat;
    });
  }

  private createCover() {
    const boxMat = new StandardMaterial('boxMat', this.scene);
    boxMat.diffuseColor = new Color3(0.4, 0.3, 0.2);

    const positions = [
      new Vector3(-10, 1, -10),
      new Vector3(10, 1, 10),
      new Vector3(-20, 1, 20),
      new Vector3(20, 1, -20),
      new Vector3(0, 1, 0),
    ];

    positions.forEach((pos, index) => {
      const box = MeshBuilder.CreateBox(`box_${index}`, { width: 2, height: 2, depth: 2 }, this.scene);
      box.position = pos;
      box.material = boxMat;
    });
  }

  private createSkybox() {
    const skybox = MeshBuilder.CreateBox('skyBox', { size: 200 }, this.scene);
    const skyMat = new StandardMaterial('skyMat', this.scene);
    skyMat.backFaceCulling = false;
    skyMat.diffuseColor = new Color3(0.5, 0.7, 0.9);
    skybox.material = skyMat;
  }

  initPhysics() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -20, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
  }

  update(deltaTime: number) {
    if (this.world) {
      this.world.step(1 / 60, deltaTime / 1000, 3);
    }
  }

  dispose() {
    this.scene.meshes.forEach(mesh => mesh.dispose());
  }
}