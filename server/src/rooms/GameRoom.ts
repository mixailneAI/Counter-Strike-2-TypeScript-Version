import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from "../entities/Player";
import { CombatSystem } from "../systems/CombatSystem";
import { RoundSystem } from "../systems/RoundSystem";
import { BotSystem } from "../systems/BotSystem";
import { EconomySystem } from "../systems/EconomySystem";
import { GAME_CONFIG, PLAYER_CONFIG, MAP_CONFIG } from "../../../shared/constants";
import type { InputState, Team } from "../../../shared/types";

class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("string") phase: string = "waiting";
  @type("number") roundTime: number = ROUND_CONFIG.roundTime;
  @type("number") ctScore: number = 0;
  @type("number") tScore: number = 0;
  @type("number") currentRound: number = 1;
}

export class GameRoom extends Room<GameState> {
  maxClients = GAME_CONFIG.maxPlayers;
  state = new GameState();

  public combatSystem = new CombatSystem(this);
  public roundSystem = new RoundSystem(this);
  public botSystem = new BotSystem(this);
  public economySystem = new EconomySystem(this);
  public playerPhysics = new Map<string, {
    vx: number; vy: number; vz: number;
    onGround: boolean;
  }>();

  onCreate() {
    this.setState(this.state);

    this.onMessage("input", (client, data: InputState) => {
      this.handleInput(client, data);
    });

    this.onMessage("shoot", (client) => {
      this.combatSystem.handleShoot(client);
    });

    this.onMessage("reload", (client) => {
      this.combatSystem.handleReload(client);
    });

    this.onMessage("switchWeapon", (client, data) => {
      this.combatSystem.switchWeapon(client, data.weapon);
    });

    this.onMessage("buyWeapon", (client, data) => {
      this.economySystem.buyWeapon(client, data.weapon);
    });

    this.onMessage("consoleCommand", (client, data) => {
      this.handleConsoleCommand(client, data);
    });

    this.onMessage("antiCheatReport", (client, data) => {
      console.warn(`🚨 AntiCheat Report from ${client.sessionId}:`, data);
    });

    this.onMessage("chat", (client, data) => {
      this.handleChat(client, data);
    });

    this.setSimulationInterval((dt) => this.update(dt), 1000 / GAME_CONFIG.tickRate);
  }

  onJoin(client: Client, options: any) {
    const player = new Player();
    player.id = client.sessionId;
    player.name = options.name || `Player_${Math.random().toString(36).substr(2, 5)}`;
    player.isBot = false;

    const ctCount = Array.from(this.state.players.values()).filter(p => p.team === "ct").length;
    const tCount = Array.from(this.state.players.values()).filter(p => p.team === "t").length;
    player.team = (ctCount <= tCount ? "ct" : "t") as Team;

    const spawn = this.getSpawnPosition(player.team);
    player.positionX = spawn.x;
    player.positionY = spawn.y;
    player.positionZ = spawn.z;

    this.playerPhysics.set(client.sessionId, {
      vx: 0, vy: 0, vz: 0, onGround: true,
    });

    this.state.players.set(client.sessionId, player);
    client.send("welcome", { playerId: client.sessionId, team: player.team });
    this.broadcast("playerJoined", { id: player.id, name: player.name, team: player.team });

    if (this.state.phase === "waiting" && this.state.players.size >= 2) {
      this.roundSystem.startRound();
    }
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    this.playerPhysics.delete(client.sessionId);
    this.broadcast("playerLeft", { id: client.sessionId });
  }

  private update(dt: number) {
    if (this.state.phase !== "playing") return;

    const delta = dt / 1000;

    this.state.players.forEach((player, id) => {
      if (!player.alive) return;

      const phys = this.playerPhysics.get(id)!;

      if (!phys.onGround) {
        phys.vy += GAME_CONFIG.gravity * delta;
      }

      player.positionX += phys.vx * delta;
      player.positionY += phys.vy * delta;
      player.positionZ += phys.vz * delta;

      player.positionX = Math.max(-50, Math.min(50, player.positionX));
      player.positionZ = Math.max(-50, Math.min(50, player.positionZ));

      if (player.positionY <= 0) {
        player.positionY = 0;
        phys.vy = 0;
        phys.onGround = true;
      }

      phys.vx *= 0.85;
      phys.vz *= 0.85;
    });

    this.combatSystem.updateProjectiles(delta);
    this.botSystem.update(delta);

    this.state.roundTime -= dt;
    if (this.state.roundTime <= 0) {
      this.roundSystem.endRound("time");
    }
  }

  private handleInput(client: Client, data: InputState) {
    const player = this.state.players.get(client.sessionId);
    if (!player || !player.alive) return;

    const phys = this.playerPhysics.get(client.sessionId)!;
    const speed = data.sprint ? PLAYER_CONFIG.sprintSpeed : PLAYER_CONFIG.moveSpeed;

    let moveX = data.moveX || 0;
    let moveZ = data.moveZ || 0;
    const magnitude = Math.sqrt(moveX ** 2 + moveZ ** 2);

    if (magnitude > 0) {
      moveX = (moveX / magnitude) * speed;
      moveZ = (moveZ / magnitude) * speed;
    }

    const yaw = player.rotationY * (Math.PI / 180);
    phys.vx = moveX * Math.cos(yaw) - moveZ * Math.sin(yaw);
    phys.vz = moveX * Math.sin(yaw) + moveZ * Math.cos(yaw);

    if (data.jump && phys.onGround) {
      phys.vy = PLAYER_CONFIG.jumpForce;
      phys.onGround = false;
    }

    player.rotationX = data.rotX;
    player.rotationY = data.rotY;
  }

  private handleConsoleCommand(client: Client, data: any) {
    const { command, ...args } = data;

    switch (command) {
      case 'bot_add_t':
        this.botSystem.addBot('t', args.name);
        break;
      case 'bot_add_ct':
        this.botSystem.addBot('ct', args.name);
        break;
      case 'bot_kick':
        this.botSystem.kickBot(args.target);
        break;
      case 'bot_difficulty':
        this.botSystem.setDifficulty(args.difficulty);
        break;
      case 'kill':
        const player = this.state.players.get(client.sessionId);
        if (player) {
          player.health = 0;
          player.alive = false;
        }
        break;
      case 'give':
        this.combatSystem.switchWeapon(client, args.weapon);
        break;
      case 'mp_restartgame':
        setTimeout(() => this.roundSystem.startRound(), (args.seconds || 1) * 1000);
        break;
    }
  }

  private handleChat(client: Client, data: { message: string; teamOnly: boolean }) {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    this.broadcast("chat", {
      playerId: client.sessionId,
      playerName: player.name,
      team: player.team,
      message: data.message,
      teamOnly: data.teamOnly,
      timestamp: Date.now(),
    });
  }

  getSpawnPosition(team: Team): { x: number; y: number; z: number } {
    const spawns = MAP_CONFIG.spawns[team];
    const spawn = spawns[Math.floor(Math.random() * spawns.length)];
    return { x: spawn.x, y: spawn.y, z: spawn.z };
  }

  checkRoundEnd() {
    const ctAlive = Array.from(this.state.players.values())
      .some(p => p.team === "ct" && p.alive);
    const tAlive = Array.from(this.state.players.values())
      .some(p => p.team === "t" && p.alive);

    if (!ctAlive || !tAlive) {
      this.roundSystem.endRound(!ctAlive ? "t_win" : "ct_win");
    }
  }
}