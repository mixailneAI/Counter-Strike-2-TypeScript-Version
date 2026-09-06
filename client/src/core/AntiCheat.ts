import { NetworkManager } from './NetworkManager';
import { PLAYER_CONFIG } from '../../../../shared/constants';
import type { Violation } from '../../../shared/types';

interface PlayerSnapshot {
  position: { x: number; y: number; z: number };
  timestamp: number;
  health: number;
}

export class AntiCheat {
  private snapshots: Map<string, PlayerSnapshot[]> = new Map();
  private violations: Map<string, Violation[]> = new Map();
  private maxSnapshots = 20;
  private maxViolations = 10;

  private readonly MAX_SPEED = PLAYER_CONFIG.sprintSpeed * 1.2;
  private readonly MAX_TELEPORT_DISTANCE = 10;
  private readonly MAX_HEALTH = PLAYER_CONFIG.maxHealth;
  private readonly MIN_FIRE_RATE = 50;

  private lastShotTime: Map<string, number> = new Map();

  constructor(private networkManager: NetworkManager) {}

  checkPlayer(playerId: string, position: { x: number; y: number; z: number }, health: number) {
    const snapshots = this.snapshots.get(playerId) || [];
    const now = Date.now();

    if (snapshots.length > 0) {
      const lastSnapshot = snapshots[snapshots.length - 1];
      const deltaTime = (now - lastSnapshot.timestamp) / 1000;

      this.checkSpeed(playerId, lastSnapshot.position, position, deltaTime);
      this.checkTeleport(playerId, lastSnapshot.position, position);
    }

    this.checkHealth(playerId, health);

    snapshots.push({ position, timestamp: now, health });
    if (snapshots.length > this.maxSnapshots) {
      snapshots.shift();
    }
    this.snapshots.set(playerId, snapshots);
  }

  private checkSpeed(playerId: string, from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }, deltaTime: number) {
    if (deltaTime <= 0) return;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const speed = distance / deltaTime;

    if (speed > this.MAX_SPEED) {
      this.addViolation(playerId, {
        type: 'SPEED_HACK',
        severity: 'high',
        message: `Speed: ${speed.toFixed(2)} m/s (max: ${this.MAX_SPEED})`,
        timestamp: Date.now(),
      });
    }
  }

  private checkTeleport(playerId: string, from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance > this.MAX_TELEPORT_DISTANCE) {
      this.addViolation(playerId, {
        type: 'TELEPORT',
        severity: 'critical',
        message: `Teleported ${distance.toFixed(2)}m instantly`,
        timestamp: Date.now(),
      });
    }
  }

  private checkHealth(playerId: string, health: number) {
    if (health > this.MAX_HEALTH) {
      this.addViolation(playerId, {
        type: 'HEALTH_HACK',
        severity: 'critical',
        message: `Health: ${health} (max: ${this.MAX_HEALTH})`,
        timestamp: Date.now(),
      });
    }
  }

  private addViolation(playerId: string, violation: Violation) {
    const violations = this.violations.get(playerId) || [];
    violations.push(violation);

    if (violations.length > this.maxViolations) {
      violations.shift();
    }

    this.violations.set(playerId, violations);

    console.warn(`🚨 ANTI-CHEAT [${violation.severity.toUpperCase()}] Player ${playerId}: ${violation.type} - ${violation.message}`);

    this.networkManager.sendAntiCheatReport(playerId, violation);

    this.checkKickThreshold(playerId);
  }

  private checkKickThreshold(playerId: string) {
    const violations = this.violations.get(playerId) || [];

    const criticalCount = violations.filter(v => v.severity === 'critical').length;
    const highCount = violations.filter(v => v.severity === 'high').length;

    if (criticalCount >= 2 || highCount >= 5) {
      console.error(`🚫 KICKING PLAYER ${playerId} - Too many violations`);
    }
  }

  getViolations(playerId: string): Violation[] {
    return this.violations.get(playerId) || [];
  }

  clearViolations(playerId: string) {
    this.violations.delete(playerId);
  }

  dispose() {
    this.snapshots.clear();
    this.violations.clear();
    this.lastShotTime.clear();
  }
}