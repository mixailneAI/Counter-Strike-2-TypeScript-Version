import { UniversalCamera } from '@babylonjs/core';
import type { InputState } from '../../../shared/types';

export class InputManager {
  private camera: UniversalCamera;
  private isMobile: boolean;

  private moveX = 0;
  private moveZ = 0;
  private rotX = 0;
  private rotY = 0;
  private jump = false;
  private crouch = false;
  private sprint = false;
  private shoot = false;
  private aim = false;

  private keys: Record<string, boolean> = {};

  constructor(camera: UniversalCamera, isMobile: boolean) {
    this.camera = camera;
    this.isMobile = isMobile;

    if (!isMobile) {
      this.setupKeyboardControls();
      this.setupMouseControls();
    }
  }

  private setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  private setupMouseControls() {
    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement) {
        this.rotY += e.movementX * 0.1;
        this.rotX -= e.movementY * 0.1;
        this.rotX = Math.max(-90, Math.min(90, this.rotX));
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.shoot = true;
        if (!document.pointerLockElement) {
          document.body.requestPointerLock();
        }
      } else if (e.button === 2) {
        this.aim = true;
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.shoot = false;
      } else if (e.button === 2) {
        this.aim = false;
      }
    });

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  update(deltaTime: number) {
    if (!this.isMobile) {
      this.moveX = 0;
      this.moveZ = 0;

      if (this.keys['w']) this.moveZ = 1;
      if (this.keys['s']) this.moveZ = -1;
      if (this.keys['a']) this.moveX = -1;
      if (this.keys['d']) this.moveX = 1;

      this.jump = this.keys[' '] || false;
      this.crouch = this.keys['c'] || false;
      this.sprint = this.keys['shift'] || false;

      this.camera.rotation.x = this.rotX * (Math.PI / 180);
      this.camera.rotation.y = this.rotY * (Math.PI / 180);
    }
  }

  getState(): InputState {
    return {
      moveX: this.moveX,
      moveZ: this.moveZ,
      rotX: this.rotX,
      rotY: this.rotY,
      jump: this.jump,
      crouch: this.crouch,
      sprint: this.sprint,
      shoot: this.shoot,
      aim: this.aim,
    };
  }

  setMovement(x: number, z: number) {
    this.moveX = x;
    this.moveZ = z;
  }

  setRotation(x: number, y: number) {
    this.rotX = x;
    this.rotY = y;
  }

  setJump(active: boolean) {
    this.jump = active;
  }

  setSprint(active: boolean) {
    this.sprint = active;
  }

  setShoot(active: boolean) {
    this.shoot = active;
  }
}