export type Team = 'ct' | 't';
export type WeaponType = 'pistol' | 'ak47' | 'm4a1' | 'awp' | 'knife' | 'deagle' | 'mp5' | 'famas';
export type GamePhase = 'waiting' | 'freezeTime' | 'playing' | 'roundEnd' | 'matchEnd' | 'buyTime';
export type WeaponSlot = 'primary' | 'secondary' | 'knife' | 'grenade';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface PlayerState {
  id: string;
  name: string;
  team: Team;
  position: Vector3;
  rotation: Vector2;
  velocity: Vector3;
  health: number;
  armor: number;
  alive: boolean;
  weapons: WeaponType[];
  currentWeapon: WeaponType;
  ammo: number;
  reserveAmmo: number;
  isReloading: boolean;
  isScoped: boolean;
  kills: number;
  deaths: number;
  assists: number;
  money: number;
  hasDefuseKit: boolean;
  isBot: boolean;
}

export interface WeaponConfig {
  type: WeaponType;
  name: string;
  slot: WeaponSlot;
  damage: number;
  fireRate: number;
  recoil: { x: number; y: number };
  spread: number;
  magazineSize: number;
  reloadTime: number;
  price: number;
  killAward: number;
  range: number;
  penetration: number;
  zoomLevel?: number;
  automatic: boolean;
}

export interface InputState {
  moveX: number;
  moveZ: number;
  rotX: number;
  rotY: number;
  jump: boolean;
  crouch: boolean;
  sprint: boolean;
  shoot: boolean;
  aim: boolean;
}

export interface KillEvent {
  killerId: string;
  killerName: string;
  killerTeam: Team;
  victimId: string;
  victimName: string;
  victimTeam: Team;
  weapon: WeaponType;
  headshot: boolean;
  wallbang: boolean;
  timestamp: number;
}

export interface ChatMessage {
  playerId: string;
  playerName: string;
  team: Team;
  message: string;
  teamOnly: boolean;
  timestamp: number;
}

export interface Violation {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  playerId?: string;
}

export interface GameState {
  phase: GamePhase;
  roundTime: number;
  ctScore: number;
  tScore: number;
  currentRound: number;
}