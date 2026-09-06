import { Scene, Vector3, ParticleSystem, Texture, Color4 } from '@babylonjs/core';

export class EffectsSystem {
  private scene: Scene;
  private particles: ParticleSystem[] = [];

  constructor(scene: Scene) {
    this.scene = scene;
  }

  createMuzzleFlash(playerId: string) {
    // Вспышка выстрела
  }

  createBloodEffect(position: Vector3) {
    // Эффект крови
  }

  createBulletTracer(start: Vector3, end: Vector3) {
    // Трассер пули
  }

  update(deltaTime: number) {
    this.particles = this.particles.filter(p => p.isAlive());
  }

  dispose() {
    this.particles.forEach(p => p.dispose());
    this.particles = [];
  }
}