<template>
  <div class="w-full max-w-2xl">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h3 class="text-cs-ct text-xl font-bold text-center mb-2">COUNTER-TERRORISTS</h3>
        <div class="space-y-1">
          <div v-for="player in ctPlayers" :key="player.id" class="bg-black/40 px-3 py-2 rounded text-white flex justify-between">
            <span>{{ player.name }}</span>
            <span>{{ player.kills }}/{{ player.deaths }}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 class="text-cs-t text-xl font-bold text-center mb-2">TERRORISTS</h3>
        <div class="space-y-1">
          <div v-for="player in tPlayers" :key="player.id" class="bg-black/40 px-3 py-2 rounded text-white flex justify-between">
            <span>{{ player.name }}</span>
            <span>{{ player.kills }}/{{ player.deaths }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

const ctPlayers = computed(() => gameStore.players.filter(p => p.team === 'ct'));
const tPlayers = computed(() => gameStore.players.filter(p => p.team === 't'));
</script>