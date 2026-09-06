import { Client, Room } from 'colyseus.js';
import { useGameStore } from '../stores/gameStore';
import type { InputState, KillEvent, PlayerState, Violation } from '../../../shared/types';

export class NetworkManager {
  private client: Client;
  private room: Room | null = null;
  private gameStore = useGameStore();

  private playerUpdateCallbacks: ((data: PlayerState) => void)[] = [];
  private killCallbacks: ((data: KillEvent) => void)[] = [];
  private shotCallbacks: ((data: any) => void)[] = [];
  private roundStartCallbacks: ((data: any) => void)[] = [];
  private roundEndCallbacks: ((data: any) => void)[] = [];
  private matchEndCallbacks: ((data: any) => void)[] = [];

  constructor() {
    this.client = new Client('ws://localhost:2567');
  }

  async connect(playerName: string) {
    this.room = await this.client.joinOrCreate('game', { name: playerName });

    this.room.onJoin(() => {
      console.log('✅ Connected to game room');
    });

    this.room.onLeave(() => {
      console.log('❌ Disconnected from game room');
    });

    this.room.onError((code, message) => {
      console.error('🚨 Room error:', code, message);
    });

    this.room.state.players.onAdd((player, sessionId) => {
      player.onChange(() => {
        if (sessionId === this.room?.sessionId) {
          this.gameStore.updatePlayer({
            id: player.id,
            name: player.name,
            team: player.team,
            position: { x: player.positionX, y: player.positionY, z: player.positionZ },
            rotation: { x: player.rotationX, y: player.rotationY },
            health: player.health,
            armor: player.armor,
            alive: player.alive,
            currentWeapon: player.weapon,
            ammo: player.ammo,
            reserveAmmo: player.reserveAmmo,
            isReloading: player.isReloading,
            kills: player.kills,
            deaths: player.deaths,
            money: player.money,
          });
        }
      });
    });

    this.room.onMessage('kill', (data: KillEvent) => {
      this.killCallbacks.forEach(cb => cb(data));
    });

    this.room.onMessage('shot', (data) => {
      this.shotCallbacks.forEach(cb => cb(data));
    });

    this.room.onMessage('roundStart', (data) => {
      this.roundStartCallbacks.forEach(cb => cb(data));
    });

    this.room.onMessage('roundEnd', (data) => {
      this.roundEndCallbacks.forEach(cb => cb(data));
    });

    this.room.onMessage('matchEnd', (data) => {
      this.matchEndCallbacks.forEach(cb => cb(data));
    });
  }

  sendInput(input: InputState) {
    this.room?.send('input', input);
  }

  sendShoot() {
    this.room?.send('shoot');
  }

  sendReload() {
    this.room?.send('reload');
  }

  sendSwitchWeapon(weapon: string) {
    this.room?.send('switchWeapon', { weapon });
  }

  sendBuyWeapon(weapon: string) {
    this.room?.send('buyWeapon', { weapon });
  }

  sendConsoleCommand(command: string, data?: any) {
    this.room?.send('consoleCommand', { command, ...data });
  }

  sendAntiCheatReport(playerId: string, violation: Violation) {
    this.room?.send('antiCheatReport', { playerId, violation });
  }

  onPlayerUpdate(callback: (data: PlayerState) => void) {
    this.playerUpdateCallbacks.push(callback);
  }

  onKill(callback: (data: KillEvent) => void) {
    this.killCallbacks.push(callback);
  }

  onShot(callback: (data: any) => void) {
    this.shotCallbacks.push(callback);
  }

  onRoundStart(callback: (data: any) => void) {
    this.roundStartCallbacks.push(callback);
  }

  onRoundEnd(callback: (data: any) => void) {
    this.roundEndCallbacks.push(callback);
  }

  onMatchEnd(callback: (data: any) => void) {
    this.matchEndCallbacks.push(callback);
  }

  disconnect() {
    this.room?.leave();
  }
}