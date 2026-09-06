import { Client } from "colyseus";
import { GameRoom } from "../rooms/GameRoom";
import { WEAPONS, ECONOMY_CONFIG } from "../../../shared/constants";
import type { WeaponType } from "../../../shared/types";

export class EconomySystem {
  private room: GameRoom;

  constructor(room: GameRoom) {
    this.room = room;
  }

  buyWeapon(client: Client, weaponType: WeaponType) {
    const player = this.room.state.players.get(client.sessionId);
    if (!player || !player.alive) return;

    const weapon = WEAPONS[weaponType];
    if (!weapon) return;

    if (player.money < weapon.price) {
      client.send("buyFailed", { reason: "insufficient_funds" });
      return;
    }

    player.money -= weapon.price;
    player.weapon = weaponType;
    player.ammo = weapon.magazineSize;
    player.reserveAmmo = weapon.magazineSize * 3;
    player.isReloading = false;

    client.send("buySuccess", { weapon: weaponType });
  }

  giveRoundReward(team: string, amount: number) {
    this.room.state.players.forEach((player) => {
      if (player.team === team) {
        player.money = Math.min(player.money + amount, ECONOMY_CONFIG.maxMoney);
      }
    });
  }
}