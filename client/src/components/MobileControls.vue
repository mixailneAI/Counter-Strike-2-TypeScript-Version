<template>
  <div class="fixed inset-0 pointer-events-none">
    <div class="absolute bottom-8 left-8 pointer-events-auto">
      <div class="joystick-base" @touchstart="startJoystick" @touchmove="moveJoystick" @touchend="endJoystick">
        <div class="joystick-stick" :style="joystickStyle"></div>
      </div>
    </div>

    <div class="absolute top-0 right-0 w-1/2 h-full pointer-events-auto" @touchstart="startLook" @touchmove="moveLook" @touchend="endLook"></div>

    <div class="absolute bottom-8 right-8 flex flex-col gap-4 pointer-events-auto">
      <button class="w-20 h-20 bg-red-500/80 rounded-full text-white text-3xl font-bold active:bg-red-600" @touchstart="startShoot" @touchend="endShoot">
        🔫
      </button>

      <button class="w-16 h-16 bg-blue-500/80 rounded-full text-white text-2xl font-bold active:bg-blue-600" @touchstart="jump" @touchend="endJump">
        ⬆️
      </button>

      <button class="w-16 h-16 bg-yellow-500/80 rounded-full text-white text-2xl font-bold active:bg-yellow-600" @touchstart="reload">
        🔄
      </button>

      <button class="w-16 h-16 bg-green-500/80 rounded-full text-white text-2xl font-bold active:bg-green-600" @touchstart="startSprint" @touchend="endSprint">
        🏃
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits<{
  (e: 'move', data: { x: number; z: number }): void;
  (e: 'look', data: { x: number; y: number }): void;
  (e: 'shoot'): void;
  (e: 'jump'): void;
  (e: 'reload'): void;
  (e: 'sprint', active: boolean): void;
}>();

const joystickX = ref(0);
const joystickY = ref(0);
const joystickCenter = ref({ x: 0, y: 0 });
const joystickActive = ref(false);

const lookStart = ref({ x: 0, y: 0 });
const lookActive = ref(false);
const rotationX = ref(0);
const rotationY = ref(0);

const joystickStyle = computed(() => ({
  left: `${50 + joystickX.value}%`,
  top: `${50 + joystickY.value}%`,
}));

function startJoystick(e: TouchEvent) {
  const touch = e.touches[0];
  const rect = (e.target as HTMLElement).getBoundingClientRect();
  joystickCenter.value = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
  joystickActive.value = true;
  moveJoystick(e);
}

function moveJoystick(e: TouchEvent) {
  if (!joystickActive.value) return;
  const touch = e.touches[0];
  const dx = touch.clientX - joystickCenter.value.x;
  const dy = touch.clientY - joystickCenter.value.y;
  const maxDistance = 50;
  const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
  const angle = Math.atan2(dy, dx);
  joystickX.value = (Math.cos(angle) * distance / maxDistance) * 50;
  joystickY.value = (Math.sin(angle) * distance / maxDistance) * 50;
  emit('move', { x: joystickX.value / 50, z: -joystickY.value / 50 });
}

function endJoystick() {
  joystickActive.value = false;
  joystickX.value = 0;
  joystickY.value = 0;
  emit('move', { x: 0, z: 0 });
}

function startLook(e: TouchEvent) {
  const touch = e.touches[0];
  lookStart.value = { x: touch.clientX, y: touch.clientY };
  lookActive.value = true;
}

function moveLook(e: TouchEvent) {
  if (!lookActive.value) return;
  const touch = e.touches[0];
  const dx = touch.clientX - lookStart.value.x;
  const dy = touch.clientY - lookStart.value.y;
  rotationY.value += dx * 0.5;
  rotationX.value -= dy * 0.5;
  rotationX.value = Math.max(-90, Math.min(90, rotationX.value));
  lookStart.value = { x: touch.clientX, y: touch.clientY };
  emit('look', { x: rotationX.value, y: rotationY.value });
}

function endLook() {
  lookActive.value = false;
}

function startShoot() {
  emit('shoot');
}

function endShoot() {}

function jump() {
  emit('jump');
}

function endJump() {}

function reload() {
  emit('reload');
}

function startSprint() {
  emit('sprint', true);
}

function endSprint() {
  emit('sprint', false);
}
</script>