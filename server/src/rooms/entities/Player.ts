import { Schema, type } from "@colyseus/schema";
import type { Team, WeaponType } from "../../../shared/types";

export class Player extends Schema {
  @type("string") id = "";
  @type("string") name = "";
  @type("string") team: Team = "ct";

  @type("number") positionX = 0;
  @type("number") positionY = 0;
  @type("number") positionZ = 0;

  @type("number") rotationX = 0;
  @type("number") rotationY = 0;

  @type("number") health = 100;
  @type("number") armor = 0;
  @type("boolean") alive = true;

  @type("string") weapon: WeaponType = "pistol";
  @type("number") ammo = 12;
  @type("number") reserveAmmo = 36;
  @type("boolean") isReloading = false;

  @type("number") kills = 0;
  @type("number") deaths = 0;
  @type("number") assists = 0;
  @type("number") money = 800;
  @type("boolean") hasDefuseKit = false;
  @type("boolean") isBot = false;

  lastShotTime = 0;
}