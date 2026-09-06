export class Projectile {
  id: string = "";
  ownerId: string = "";
  ownerTeam: string = "";

  startX: number = 0;
  startY: number = 0;
  startZ: number = 0;

  dirX: number = 0;
  dirY: number = 0;
  dirZ: number = 0;

  damage: number = 0;
  speed: number = 150;
  distance: number = 0;
  maxDistance: number = 100;
  active: boolean = true;
}