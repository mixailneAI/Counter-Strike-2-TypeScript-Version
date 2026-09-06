<template>
  <div class="fixed inset-0 pointer-events-none">
    <div class="absolute bottom-4 left-4 text-white">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl font-bold">❤️</span>
        <div class="w-32 h-4 bg-gray-800 rounded-full overflow-hidden">
          <div class="h-full bg-cs-health transition-all duration-300" :style="{ width: `${gameStore.player.health}%` }"></div>
        </div>
        <span class="text-xl font-bold">{{ gameStore.player.health }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-2xl font-bold">🛡️</span>
        <div class="w-32 h-4 bg-gray-800 rounded-full overflow-hidden">
          <div class="h-full bg-cs-armor transition-all duration-300" :style="{ width: `${gameStore.player.armor}%` }"></div>
        </div>
        <span class="text-xl font-bold">{{ gameStore.player.armor }}</span>
      </div>
    </div>

    <div class="absolute bottom-4 right-4 text-white text-right">
      <div class="text-3xl font-bold">
        <span>{{ gameStore.player.ammo }}</span>
        <span class="text-gray-400 text-xl">/ {{ gameStore.player.reserveAmmo }}</span>
      </div>
      <div class="text-sm text-gray-400 uppercase">{{ gameStore.player.currentWeapon }}</div>
      <div v-if="gameStore.player.isReloading" class="text-cs-primary text-sm mt-1 animate-pulse-custom">ПЕРЕЗАРЯДКА...</div>
    </div>

    <div class="absolute top-4 left-1/2 -translate-x-1/2 text-white text-center">
      <div class="flex items-center gap-4 bg-black/60 px-6 py-2 rounded-lg backdrop-blur-sm">
        <div class="text-cs-ct text-2xl font-bold">{{ gameStore.ctScore }}</div>
        <div class="text-gray-400">РАУНД {{ gameStore.currentRound }}</div>
        <div class="text-cs-t text-2xl font-bold">{{ gameStore.tScore }}</div>
      </div>
      <div class="text-sm text-gray-400 mt-1">{{ formatTime(gameStore.roundTime) }}</div>
    </div>

    <div class="absolute top-4 left-4 text-cs-primary text-xl font-bold">
      ${{ gameStore.player.money }}
    </div>

    <div class="absolute top-4 right-4 text-white text-right">
      <div class="text-sm text-gray-400">K/D</div>
      <div class="text-xl font-bold">{{ gameStore.player.kills }} / {{ gameStore.player.deaths }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
</script>