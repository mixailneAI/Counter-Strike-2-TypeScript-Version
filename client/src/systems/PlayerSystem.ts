import { Scene, Mesh, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { NetworkManager } from '../core/NetworkManager';
import type { PlayerState } from '../../../shared/types';

export class PlayerSystem {
  private scene: Scene;
  private networkManager: NetworkManager;
  private playerMeshes = new Map<string, Mesh>();

  constructor(scene: Scene, networkManager: NetworkManager) {
    this.scene = scene;
    this.networkManager = networkManager;
  }

  updatePlayer(data: PlayerState) {
    let mesh = this.playerMeshes.get(data.id);

    if (!mesh) {
      mesh = MeshBuilder.CreateCapsule('player_' + data.id, { height: 1.8, radius: 0.4 }, this.scene);
      const mat = new StandardMaterial('playerMat_' + data.id, this.scene);
      mat.diffuseColor = data.team === 'ct' ? new Color3(0.36, 0.47, 0.63) : new Color3(0.78, 0.66, 0.36);
      mesh.material = mat;
      this.playerMeshes.set(data.id, mesh);
    }

    mesh.position.set(data.position.x, data.position.y + 0.9, data.position.z);
    mesh.rotation.y = data.rotation.y * (Math.PI / 180);
    mesh.isVisible = data.alive;
  }

  update(deltaTime: number) {
    // Интерполяция для плавного движения
  }

  removePlayer(id: string) {
    const mesh = this.playerMeshes.get(id);
    if (mesh) {
      mesh.dispose();
      this.playerMeshes.delete(id);
    }
  }

  dispose() {
    this.playerMeshes.forEach(mesh => mesh.dispose());
    this.playerMeshes.clear();
  }
}