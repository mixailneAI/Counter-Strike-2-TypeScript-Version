<template>
  <div class="fixed inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-game font-bold text-cs-primary mb-8">CS2 CLONE</h1>
      <div class="space-y-4">
        <input
          v-model="playerName"
          type="text"
          placeholder="Введите имя..."
          class="px-6 py-3 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:border-cs-primary outline-none text-xl w-64"
          @keyup.enter="joinGame"
        />
        <button
          @click="joinGame"
          :disabled="!playerName.trim()"
          class="block mx-auto px-8 py-3 bg-cs-primary text-black font-bold rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed text-xl"
        >
          ИГРАТЬ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'join-game', name: string): void;
}>();

const playerName = ref('');

function joinGame() {
  if (playerName.value.trim()) {
    emit('join-game', playerName.value.trim());
  }
}
</script>