<template>
  <div class="w-full h-full relative">
    <Menu v-if="gameStore.state === 'menu'" @join-game="joinGame" />

    <div v-if="gameStore.state === 'loading'" class="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div class="text-center">
        <h2 class="text-white text-2xl font-game mb-4">Загрузка...</h2>
        <div class="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div class="h-full bg-cs-primary transition-all duration-300" :style="{ width: `${gameStore.loadProgress}%` }"></div>
        </div>
        <p class="text-gray-400 mt-2 text-sm">{{ gameStore.loadingMessage }}</p>
      </div>
    </div>

    <div v-if="gameStore.state === 'playing' || gameStore.state === 'freezeTime'" class="w-full h-full">
      <canvas id="gameCanvas" ref="canvasRef"></canvas>
      <HUD />
      <MobileControls v-if="isMobile" @move="handleMove" @look="handleLook" @shoot="handleShoot" @jump="handleJump" @reload="handleReload" @sprint="handleSprint" />
      <div class="crosshair" :class="{ 'opacity-50': gameStore.player.isReloading }"></div>
      <div class="damage-overlay" :class="{ active: gameStore.damageFlash }"></div>
      <div class="kill-feed">
        <div v-for="entry in gameStore.killFeed" :key="entry.id" class="kill-entry">
          <span :class="entry.killerTeam === 'ct' ? 'text-cs-ct' : 'text-cs-t'">{{ entry.killerName }}</span>
          <span class="text-gray-400 mx-1">[{{ entry.weapon }}]</span>
          <span :class="entry.victimTeam === 'ct' ? 'text-cs-ct' : 'text-cs-t'">{{ entry.victimName }}</span>
          <span v-if="entry.headshot" class="text-yellow-400 ml-1">★</span>
        </div>
      </div>
      <div v-if="gameStore.state === 'freezeTime'" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-40">
        <h2 class="text-white text-4xl font-game font-bold">РАУНД {{ gameStore.currentRound }}</h2>
        <p class="text-cs-primary text-xl mt-2">ПРИГОТОВЬТЕСЬ</p>
      </div>
    </div>

    <div v-if="gameStore.state === 'matchEnd'" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div class="text-center animate-fade-in">
        <h1 class="text-5xl font-game font-bold mb-4" :class="gameStore.matchWinner === gameStore.player.team ? 'text-cs-primary' : 'text-red-500'">
          {{ gameStore.matchWinner === gameStore.player.team ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ' }}
        </h1>
        <Scoreboard />
        <button @click="gameStore.reset()" class="mt-8 px-8 py-3 bg-cs-primary text-black font-bold rounded-lg hover:bg-yellow-400 transition">В МЕНЮ</button>
      </div>
    </div>

    <BuyMenu v-if="showBuyMenu" @close="showBuyMenu = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useGameStore } from './stores/gameStore';
import Menu from './components/Menu.vue';
import HUD from './components/HUD.vue';
import MobileControls from './components/MobileControls.vue';
import BuyMenu from './components/BuyMenu.vue';
import Scoreboard from './components/Scoreboard.vue';
import { GameEngine } from './core/GameEngine';

const gameStore = useGameStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isMobile = ref(false);
const showBuyMenu = ref(false);
let gameEngine: GameEngine | null = null;

onMounted(() => {
  isMobile.value = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || 'ontouchstart' in window;

  watch(() => gameStore.state, async (newState) => {
    if (newState === 'loading' && canvasRef.value) {
      await initGame();
    }
  });
});

async function initGame() {
  if (!canvasRef.value) return;

  gameStore.loadingMessage = 'Инициализация...';
  gameStore.loadProgress = 10;

  gameEngine = new GameEngine(canvasRef.value, isMobile.value);

  gameStore.loadingMessage = 'Загрузка ресурсов...';
  gameStore.loadProgress = 30;
  await gameEngine.loadAssets();

  gameStore.loadingMessage = 'Настройка физики...';
  gameStore.loadProgress = 60;
  gameEngine.initPhysics();

  gameStore.loadingMessage = 'Подключение к серверу...';
  gameStore.loadProgress = 80;
  await gameEngine.connect(gameStore.playerName);

  gameStore.loadingMessage = 'Готово!';
  gameStore.loadProgress = 100;

  setTimeout(() => {
    gameStore.state = 'playing';
    gameEngine?.start();
  }, 500);
}

const handleMove = (data: { x: number; z: number }) => gameEngine?.inputManager.setMovement(data.x, data.z);
const handleLook = (data: { x: number; y: number }) => gameEngine?.inputManager.setRotation(data.x, data.y);
const handleShoot = () => gameEngine?.inputManager.setShoot(true);
const handleJump = () => gameEngine?.inputManager.setJump(true);
const handleReload = () => gameEngine?.networkManager.sendReload();
const handleSprint = (active: boolean) => gameEngine?.inputManager.setSprint(active);

async function joinGame(name: string) {
  gameStore.playerName = name;
  gameStore.state = 'loading';
}

onUnmounted(() => gameEngine?.dispose());
</script>