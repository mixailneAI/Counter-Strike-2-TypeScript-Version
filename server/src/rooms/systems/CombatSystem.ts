import { Client } from "colyseus";
import { GameRoom } from "../rooms/GameRoom";
import { Projectile } from "../entities/Projectile";
import { WEAPONS } from "../../../shared/constants";
import type { WeaponType } from "../../../shared/types";

export class CombatSystem {
  private room: GameRoom;
  private projectiles = new Map<string, Projectile>();

  constructor(room: GameRoom) {
    this.room = room;
  }

  handleShoot(client: Client) {
    const player = this.room.state.players.get(client.sessionId);
    if (!player || !player.alive || player.isReloading || player.ammo <= 0) return;

    const weapon = WEAPONS[player.weapon as WeaponType];
    if (!weapon) return;

    const now = Date.now();
    if (now - player.lastShotTime < weapon.fireRate) return;
    player.lastShotTime = now;
    player.ammo--;

    const projectile = new Projectile();
    projectile.id = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    projectile.ownerId = client.sessionId;
    projectile.ownerTeam = player.team;
    projectile.damage = weapon.damage;
    projectile.maxDistance = weapon.range;
    projectile.speed = 150;

    projectile.startX = player.positionX;
    projectile.startY = player.positionY + 1.6;
    projectile.startZ = player.positionZ;

    const yaw = player.rotationY * (Math.PI / 180);
    const pitch = player.rotationX * (Math.PI / 180);
    const spread = weapon.spread * (Math.PI / 180);

    projectile.dirX = Math.sin(yaw + (Math.random() - 0.5) * spread) * Math.cos(pitch);
    projectile.dirY = Math.sin(pitch + (Math.random() - 0.5) * spread);
    projectile.dirZ = -Math.cos(yaw + (Math.random() - 0.5) * spread) * Math.cos(pitch);

    this.projectiles.set(projectile.id, projectile);
    player.rotationX -= weapon.recoil.y * 0.3;

    this.room.broadcast("shot", {
      shooterId: client.sessionId,
      weapon: player.weapon,
    });
  }

  handleReload(client: Client) {
    const player = this.room.state.players.get(client.sessionId);
    if (!player || !player.alive || player.isReloading) return;

    const weapon = WEAPONS[player.weapon as WeaponType];
    if (!weapon || player.reserveAmmo <= 0 || player.ammo >= weapon.magazineSize) return;

    player.isReloading = true;

    setTimeout(() => {
      const p = this.room.state.players.get(client.sessionId);
      if (!p) return;

      const needed = weapon.magazineSize - p.ammo;
      const available = Math.min(needed, p.reserveAmmo);
      p.ammo += available;
      p.reserveAmmo -= available;
      p.isReloading = false;
    }, weapon.reloadTime);
  }

  switchWeapon(client: Client, weaponType: WeaponType) {
    const player = this.room.state.players.get(client.sessionId);
    if (!player || !player.alive) return;

    const weapon = WEAPONS[weaponType];
    if (!weapon) return;

    player.weapon = weaponType;
    player.ammo = weapon.magazineSize;
    player.reserveAmmo = weapon.magazineSize * 3;
    player.isReloading = false;
  }

  updateProjectiles(delta: number) {
    this.projectiles.forEach((proj, id) => {
      if (!proj.active) return;

      proj.distance += proj.speed * delta;

      const currentX = proj.startX + proj.dirX * proj.distance;
      const currentY = proj.startY + proj.dirY * proj.distance;
      const currentZ = proj.startZ + proj.dirZ * proj.distance;

      this.room.state.players.forEach((player) => {
        if (!player.alive || player.id === proj.ownerId || player.team === proj.ownerTeam) return;

        const dx = currentX - player.positionX;
        const dy = currentY - (player.positionY + 1);
        const dz = currentZ - player.positionZ;
        const dist = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);

        if (dist < 0.8) {
          const headshot = currentY > player.positionY + 1.5;
          this.applyDamage(player, proj.damage, proj.ownerId, headshot);
          proj.active = false;
        }
      });

      if (proj.distance >= proj.maxDistance) {
        proj.active = false;
      }
    });

    const toRemove: string[] = [];
    this.projectiles.forEach((p, id) => {
      if (!p.active) toRemove.push(id);
    });
    toRemove.forEach(id => this.projectiles.delete(id));
  }

  private applyDamage(player: any, damage: number, attackerId: string, headshot: boolean) {
    let actualDamage = headshot ? damage * 4 : damage;

    if (player.armor > 0) {
      player.armor = Math.max(0, player.armor - actualDamage * 0.5);
      actualDamage *= 0.5;
    }

    player.health -= actualDamage;

    if (player.health <= 0) {
      player.health = 0;
      player.alive = false;
      player.deaths++;

      const attacker = this.room.state.players.get(attackerId);
      if (attacker) {
        attacker.kills++;
        const weapon = WEAPONS[attacker.weapon as WeaponType];
        attacker.money += weapon.killAward;
      }

      this.room.broadcast("kill", {
        killerId: attackerId,
        killerName: attacker?.name || "",
        killerTeam: attacker?.team || "",
        victimId: player.id,
        victimName: player.name,
        victimTeam: player.team,
        weapon: attacker?.weapon || "",
        headshot,
        wallbang: false,
        timestamp: Date.now(),
      });

      this.room.checkRoundEnd();
    }
  }
}