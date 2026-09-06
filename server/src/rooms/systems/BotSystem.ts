import { GameRoom } from "../rooms/GameRoom";
import { Player } from "../entities/Player";
import { BOT_CONFIG, PLAYER_CONFIG } from "../../../shared/constants";
import type { Team } from "../../../shared/types";

interface Bot {
  id: string;
  name: string;
  team: Team;
  targetId: string | null;
  lastDecision: number;
  moveAngle: number;
}

export class BotSystem {
  private room: GameRoom;
  private bots = new Map<string, Bot>();
  private difficulty = 1;

  constructor(room: GameRoom) {
    this.room = room;
  }

  addBot(team: Team, name?: string) {
    const botName = name || `Bot_${BOT_CONFIG.difficulties[this.difficulty]}_${Math.floor(Math.random() * 1000)}`;
    const botId = `bot_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const player = new Player();
    player.id = botId;
    player.name = botName;
    player.team = team;
    player.isBot = true;

    const spawn = this.room.getSpawnPosition(team);
    player.positionX = spawn.x;
    player.positionY = spawn.y;
    player.positionZ = spawn.z;

    this.room.state.players.set(botId, player);
    this.room.playerPhysics.set(botId, { vx: 0, vy: 0, vz: 0, onGround: true });

    this.bots.set(botId, {
      id: botId,
      name: botName,
      team,
      targetId: null,
      lastDecision: 0,
      moveAngle: Math.random() * Math.PI * 2,
    });

    this.room.broadcast("playerJoined", { id: botId, name: botName, team });
    console.log(`✅ Bot "${botName}" added to ${team.toUpperCase()}`);
  }

  kickBot(target: string) {
    if (target === 'all') {
      this.bots.forEach((bot) => {
        this.room.state.players.delete(bot.id);
        this.room.playerPhysics.delete(bot.id);
        this.room.broadcast("playerLeft", { id: bot.id });
      });
      this.bots.clear();
      console.log('✅ All bots kicked');
    } else {
      const bot = Array.from(this.bots.values()).find(b => b.name === target);
      if (bot) {
        this.room.state.players.delete(bot.id);
        this.room.playerPhysics.delete(bot.id);
        this.bots.delete(bot.id);
        this.room.broadcast("playerLeft", { id: bot.id });
        console.log(`✅ Bot "${target}" kicked`);
      }
    }
  }

  setDifficulty(level: number) {
    this.difficulty = Math.max(0, Math.min(3, level));
    console.log(`✅ Bot difficulty: ${BOT_CONFIG.difficulties[this.difficulty]}`);
  }

  update(delta: number) {
    const now = Date.now();
    const decisionInterval = BOT_CONFIG.decisionIntervals[this.difficulty];

    this.bots.forEach((bot) => {
      if (now - bot.lastDecision < decisionInterval) return;
      bot.lastDecision = now;

      const player = this.room.state.players.get(bot.id);
      if (!player || !player.alive) return;

      let nearestEnemy: any = null;
      let nearestDistance = Infinity;

      this.room.state.players.forEach((p) => {
        if (p.team === bot.team || !p.alive) return;
        const dx = p.positionX - player.positionX;
        const dz = p.positionZ - player.positionZ;
        const dist = Math.sqrt(dx ** 2 + dz ** 2);
        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestEnemy = p;
        }
      });

      if (nearestEnemy) {
        const dx = nearestEnemy.positionX - player.positionX;
        const dz = nearestEnemy.positionZ - player.positionZ;
        const targetYaw = Math.atan2(dx, -dz) * (180 / Math.PI);

        const aimError = BOT_CONFIG.aimErrors[this.difficulty];
        player.rotationY = targetYaw + (Math.random() - 0.5) * aimError;

        if (nearestDistance < 30 && Math.random() < 0.3 + this.difficulty * 0.2) {
          this.room.combatSystem.handleShoot({ sessionId: bot.id } as any);
        }
      }

      if (Math.random() < 0.5) {
        bot.moveAngle = Math.random() * Math.PI * 2;
      }

      const phys = this.room.playerPhysics.get(bot.id);
      if (phys) {
        const speed = PLAYER_CONFIG.moveSpeed * 0.8;
        phys.vx = Math.cos(bot.moveAngle) * speed;
        phys.vz = Math.sin(bot.moveAngle) * speed;
      }
    });
  }
}