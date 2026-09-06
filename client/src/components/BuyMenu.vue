<template>
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-gray-900 rounded-lg p-8 w-96">
      <h2 class="text-2xl font-game font-bold text-white mb-6 text-center">МЕНЮ ПОКУПКИ</h2>
      <div class="text-cs-money text-center mb-4">${{ gameStore.player.money }}</div>
      <div class="space-y-2">
        <button
          v-for="item in weapons"
          :key="item.weapon"
          @click="buyWeapon(item.weapon)"
          :disabled="gameStore.player.money < item.price"
          class="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition disabled:opacity-50 flex justify-between"
        >
          <span>{{ item.name }}</span>
          <span class="text-cs-money">${{ item.price }}</span>
        </button>
      </div>
      <button @click="$emit('close')" class="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        ЗАКРЫТЬ
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { BUY_MENU, WEAPONS } from '../../../shared/constants';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const gameStore = useGameStore();

const weapons = computed(() => {
  const team = gameStore.player.team;
  return BUY_MENU[team].map(item => ({
    ...item,
    name: WEAPONS[item.weapon].name,
  }));
});

function buyWeapon(weapon: string) {
  gameStore.player.money -= WEAPONS[weapon].price;
  gameStore.player.currentWeapon = weapon;
  emit('close');
}
</script>