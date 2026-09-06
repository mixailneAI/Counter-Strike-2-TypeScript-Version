import { listen } from "@colyseus/tools";
import { GameRoom } from "./rooms/GameRoom";

async function main() {
  const app = await listen({
    port: 2567,
    serverOptions: {
      pingTimeout: 5000,
      pingInterval: 1000,
      maxPayload: 1024 * 1024,
    },
  });

  app.define("game", GameRoom, {
    maxClients: 10,
  });

  app.use("/colyseus", require("@colyseus/monitor").monitor());

  console.log("╔════════════════════════════════════════╗");
  console.log("║     🎮 CS2 Clone Server v3.0           ║");
  console.log("║     📍 Port: 2567                      ║");
  console.log("║     📊 Monitor: /colyseus              ║");
  console.log("╚════════════════════════════════════════╝");
}

main().catch(console.error);