import { GameRoom } from "../rooms/GameRoom";
import { ROUND_CONFIG, ECONOMY_CONFIG } from "../../../shared/constants";

export class RoundSystem {
  private room: GameRoom;

  constructor(room: GameRoom) {
    this.room = room;
  }

  startRound() {
    this.room.state.phase = "freezeTime";
    this.room.state.roundTime = ROUND_CONFIG.freezeTime;
    this.room.broadcast("roundStart", { round: this.room.state.currentRound });

    this.room.state.players.forEach((player) => {
      player.health = 100;
      player.alive = true;
      player.isReloading = false;

      const spawn = this.room.getSpawnPosition(player.team);
      player.positionX = spawn.x;
      player.positionY = spawn.y;
      player.positionZ = spawn.z;
    });

    setTimeout(() => {
      this.room.state.phase = "playing";
      this.room.state.roundTime = ROUND_CONFIG.roundTime;
    }, ROUND_CONFIG.freezeTime);
  }

  endRound(reason: string) {
    this.room.state.phase = "roundEnd";

    const ctAlive = Array.from(this.room.state.players.values())
      .some(p => p.team === "ct" && p.alive);
    const tAlive = Array.from(this.room.state.players.values())
      .some(p => p.team === "t" && p.alive);

    if (ctAlive && !tAlive) {
      this.room.state.ctScore++;
      this.rewardTeam("ct", ECONOMY_CONFIG.roundWinReward);
      this.rewardTeam("t", ECONOMY_CONFIG.roundLossReward);
    } else if (tAlive && !ctAlive) {
      this.room.state.tScore++;
      this.rewardTeam("t", ECONOMY_CONFIG.roundWinReward);
      this.rewardTeam("ct", ECONOMY_CONFIG.roundLossReward);
    }

    this.room.broadcast("roundEnd", {
      reason,
      ctScore: this.room.state.ctScore,
      tScore: this.room.state.tScore,
    });

    if (this.room.state.ctScore >= ROUND_CONFIG.roundsToWin ||
        this.room.state.tScore >= ROUND_CONFIG.roundsToWin) {
      this.room.broadcast("matchEnd", {
        winner: this.room.state.ctScore > this.room.state.tScore ? "ct" : "t",
      });
      return;
    }

    this.room.state.currentRound++;
    setTimeout(() => this.startRound(), 5000);
  }

  private rewardTeam(team: string, amount: number) {
    this.room.state.players.forEach((player) => {
      if (player.team === team) {
        player.money = Math.min(player.money + amount, ECONOMY_CONFIG.maxMoney);
      }
    });
  }
}