import type { WeaponConfig } from './types';

export const GAME_CONFIG = {
  maxPlayers: 10,
  tickRate: 60,
  maxBots: 9,
  mapSize: { width: 100, height: 50, depth: 100 },
  gravity: -20,
};

export const PLAYER_CONFIG = {
  maxHealth: 100,
  maxArmor: 100,
  moveSpeed: 5.5,
  sprintSpeed: 7.5,
  crouchSpeed: 2.5,
  jumpForce: 8,
  height: 1.8,
  crouchHeight: 1.2,
  eyeHeight: 1.6,
  radius: 0.4,
};

export const ROUND_CONFIG = {
  freezeTime: 5000,
  buyTime: 20000,
  roundTime: 115000,
  maxRounds: 30,
  roundsToWin: 13,
};

export const ECONOMY_CONFIG = {
  startMoney: 800,
  maxMoney: 16000,
  killReward: 300,
  roundWinReward: 3250,
  roundLossReward: 1400,
};

export const WEAPONS: Record<string, WeaponConfig> = {
  pistol: {
    type: 'pistol', name: 'USP-S', slot: 'secondary',
    damage: 32, fireRate: 400, recoil: { x: 0.3, y: 1.5 },
    spread: 3.0, magazineSize: 12, reloadTime: 2200,
    price: 0, killAward: 300, range: 100, penetration: 0.5, automatic: false,
  },
  deagle: {
    type: 'deagle', name: 'Desert Eagle', slot: 'secondary',
    damage: 63, fireRate: 267, recoil: { x: 1.0, y: 3.0 },
    spread: 4.0, magazineSize: 7, reloadTime: 2200,
    price: 700, killAward: 300, range: 120, penetration: 0.93, automatic: false,
  },
  mp5: {
    type: 'mp5', name: 'MP5-SD', slot: 'primary',
    damage: 22, fireRate: 80, recoil: { x: 0.3, y: 0.8 },
    spread: 2.5, magazineSize: 30, reloadTime: 2700,
    price: 1500, killAward: 600, range: 80, penetration: 0.5, automatic: true,
  },
  famas: {
    type: 'famas', name: 'FAMAS', slot: 'primary',
    damage: 26, fireRate: 100, recoil: { x: 0.4, y: 1.0 },
    spread: 2.2, magazineSize: 25, reloadTime: 3300,
    price: 2050, killAward: 300, range: 90, penetration: 0.7, automatic: true,
  },
  ak47: {
    type: 'ak47', name: 'AK-47', slot: 'primary',
    damage: 27, fireRate: 100, recoil: { x: 0.5, y: 1.2 },
    spread: 2.5, magazineSize: 30, reloadTime: 2500,
    price: 2700, killAward: 300, range: 100, penetration: 0.775, automatic: true,
  },
  m4a1: {
    type: 'm4a1', name: 'M4A1-S', slot: 'primary',
    damage: 23, fireRate: 88, recoil: { x: 0.4, y: 0.9 },
    spread: 2.0, magazineSize: 25, reloadTime: 3100,
    price: 3100, killAward: 300, range: 100, penetration: 0.7, automatic: true,
  },
  awp: {
    type: 'awp', name: 'AWP', slot: 'primary',
    damage: 115, fireRate: 1500, recoil: { x: 0, y: 5.0 },
    spread: 0.1, magazineSize: 10, reloadTime: 3700,
    price: 4750, killAward: 100, range: 150, penetration: 0.975, zoomLevel: 2.5, automatic: false,
  },
  knife: {
    type: 'knife', name: 'Knife', slot: 'knife',
    damage: 55, fireRate: 500, recoil: { x: 0, y: 0 },
    spread: 0, magazineSize: 1, reloadTime: 0,
    price: 0, killAward: 1500, range: 2.5, penetration: 0, automatic: false,
  },
};