import { Howl, Howler } from 'howler';

interface SoundConfig {
  src: string;
  volume: number;
  loop?: boolean;
}

export class SoundManager {
  private sounds = new Map<string, Howl>();
  private masterVolume = 0.7;

  async loadSounds() {
    const soundConfigs: Record<string, SoundConfig> = {
      shot_pistol: { src: '/sounds/weapons/pistol.mp3', volume: 0.8 },
      shot_ak47: { src: '/sounds/weapons/ak47.mp3', volume: 0.8 },
      shot_m4a1: { src: '/sounds/weapons/m4a1.mp3', volume: 0.8 },
      shot_awp: { src: '/sounds/weapons/awp.mp3', volume: 1.0 },
      shot_deagle: { src: '/sounds/weapons/deagle.mp3', volume: 0.9 },
      shot_mp5: { src: '/sounds/weapons/mp5.mp3', volume: 0.7 },
      shot_famas: { src: '/sounds/weapons/famas.mp3', volume: 0.8 },
      reload: { src: '/sounds/weapons/reload.mp3', volume: 0.6 },
      hit: { src: '/sounds/hit.mp3', volume: 0.5 },
      kill: { src: '/sounds/kill.mp3', volume: 0.7 },
      roundStart: { src: '/sounds/round_start.mp3', volume: 0.8 },
      roundEnd: { src: '/sounds/round_end.mp3', volume: 0.8 },
      footstep: { src: '/sounds/footstep.mp3', volume: 0.3 },
    };

    for (const [name, config] of Object.entries(soundConfigs)) {
      try {
        const sound = new Howl({
          src: [config.src],
          volume: config.volume * this.masterVolume,
          loop: config.loop || false,
          preload: true,
        });
        this.sounds.set(name, sound);
      } catch (error) {
        console.warn(`Failed to load sound: ${name}`);
      }
    }

    Howler.volume(this.masterVolume);
  }

  playSound(name: string, options?: { weapon?: string; position?: { x: number; y: number; z: number } }) {
    let soundName = name;

    if (name === 'shot' && options?.weapon) {
      soundName = `shot_${options.weapon}`;
    }

    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.play();
    }
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.masterVolume);
  }

  stopAll() {
    this.sounds.forEach(sound => sound.stop());
  }

  dispose() {
    this.sounds.forEach(sound => sound.unload());
    this.sounds.clear();
  }
}