import { Scene, Mesh, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { useGameStore } from '../stores/gameStore';

export class WeaponSystem {
  private scene: Scene;
  private camera: any;
  private weaponMesh: Mesh | null = null;
  private gameStore = useGameStore();

  constructor(scene: Scene, camera: any) {
    this.scene = scene;
    this.camera = camera;
  }

  update(deltaTime: number) {
    if (this.weaponMesh) {
      this.weaponMesh.position = this.camera.position.clone();
      this.weaponMesh.rotation = this.camera.rotation.clone();
    }
  }

  switchWeapon(weaponType: string) {
    if (this.weaponMesh) {
      this.weaponMesh.dispose();
    }

    this.weaponMesh = MeshBuilder.CreateBox('weapon', { width: 0.1, height: 0.1, depth: 0.5 }, this.scene);
    const mat = new StandardMaterial('weaponMat', this.scene);
    mat.diffuseColor = new Color3(0.2, 0.2, 0.2);
    this.weaponMesh.material = mat;
  }

  dispose() {
    this.weaponMesh?.dispose();
  }
}