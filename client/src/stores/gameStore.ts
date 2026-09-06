import { defineStore } from 'pinia';
import type { PlayerState, KillEvent, ChatMessage, Team, WeaponType } from '../../../shared/types';

export const useGameStore = defineStore('game', {
  state: () => ({
    state: 'menu' as 'menu' | 'loading' | 'playing' | 'freezeTime' | 'roundEnd' | 'matchEnd',
    loadProgress: 0,
    loadingMessage: '',
    playerName: '',
    player: {
      id: '',
      name: '',
      team: 'ct' as Team,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      health: 100,
      armor: 0,
      alive: true,
      weapons: ['pistol'] as WeaponType[],
      currentWeapon: 'pistol' as WeaponType,
      ammo: 12,
      reserveAmmo: 36,
      isReloading: false,
      isScoped: false,
      kills: 0,
      deaths: 0,
      assists: 0,
      money: 800,
      hasDefuseKit: false,
      isBot: false,
    } as PlayerState,
    ctScore: 0,
    tScore: 0,
    currentRound: 1,
    roundTime: 0,
    players: [] as PlayerState[],
    killFeed: [] as (KillEvent & { id: number })[],
    killFeedCounter: 0,
    damageFlash: false,
    chatMessages: [] as ChatMessage[],
    matchWinner: '' as Team | '',
  }),

  actions: {
    updatePlayer(data: Partial<PlayerState>) {
      Object.assign(this.player, data);
    },

    addKillFeed(entry: Omit<KillEvent, 'id'>) {
      this.killFeedCounter++;
      this.killFeed.unshift({ ...entry, id: this.killFeedCounter });
      if (this.killFeed.length > 5) this.killFeed.pop();

      setTimeout(() => {
        const index = this.killFeed.findIndex(k => k.id === this.killFeedCounter);
        if (index >= 0) this.killFeed.splice(index, 1);
      }, 5000);
    },

    triggerDamageFlash() {
      this.damageFlash = true;
      setTimeout(() => { this.damageFlash = false; }, 200);
    },

    reset() {
      this.state = 'menu';
      this.killFeed = [];
      this.chatMessages = [];
      this.ctScore = 0;
      this.tScore = 0;
      this.currentRound = 1;
      this.player = {
        id: '',
        name: '',
        team: 'ct',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        health: 100,
        armor: 0,
        alive: true,
        weapons: ['pistol'],
        currentWeapon: 'pistol',
        ammo: 12,
        reserveAmmo: 36,
        isReloading: false,
        isScoped: false,
        kills: 0,
        deaths: 0,
        assists: 0,
        money: 800,
        hasDefuseKit: false,
        isBot: false,
      };
    },
  },
});