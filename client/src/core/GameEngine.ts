import { Engine, Scene, Vector3, UniversalCamera, HemisphericLight, DirectionalLight } from '@babylonjs/core';
import { NetworkManager } from './NetworkManager';
import { InputManager } from './InputManager';
import { Console } from './Console';
import { AntiCheat } from './AntiCheat';
import { SoundManager } from './SoundManager';
import { PlayerSystem } from '../systems/PlayerSystem';
import { WeaponSystem } from '../systems/WeaponSystem';
import { MapSystem } from '../systems/MapSystem';
import { EffectsSystem } from '../systems/EffectsSystem';
import { useGameStore } from '../stores/gameStore';

export class GameEngine {
  private engine: Engine;
  private scene: Scene;
  private camera: UniversalCamera;

  public networkManager: NetworkManager;
  public inputManager: InputManager;
  public console: Console;
  public antiCheat: AntiCheat;
  public soundManager: SoundManager;
  public playerSystem: PlayerSystem;
  public weaponSystem: WeaponSystem;
  public mapSystem: MapSystem;
  public effectsSystem: EffectsSystem;

  private gameStore = useGameStore();
  private isMobile: boolean;
  private lastTime = 0;

  constructor(canvas: HTMLCanvasElement, isMobile: boolean) {
    this.isMobile = isMobile;

    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    this.scene = new Scene(this.engine);

    this.camera = new UniversalCamera('camera', new Vector3(0, 1.8, 0), this.scene);
    this.camera.attachControl(canvas, !isMobile);
    this.camera.minZ = 0.1;
    this.camera.speed = 0;
    this.camera.inertia = 0;

    const hemisphericLight = new HemisphericLight('hemi', new Vector3(0, 1, 0), this.scene);
    hemisphericLight.intensity = 0.7;

    const directionalLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), this.scene);
    directionalLight.intensity = 0.8;

    this.networkManager = new NetworkManager();
    this.inputManager = new InputManager(this.camera, isMobile);
    this.console = new Console(this.networkManager);
    this.antiCheat = new AntiCheat(this.networkManager);
    this.soundManager = new SoundManager();
    this.playerSystem = new PlayerSystem(this.scene, this.networkManager);
    this.weaponSystem = new WeaponSystem(this.scene, this.camera);
    this.mapSystem = new MapSystem(this.scene);
    this.effectsSystem = new EffectsSystem(this.scene);

    this.engine.runRenderLoop(() => this.render());
  }

  async loadAssets() {
    await this.mapSystem.createMap();
    await this.soundManager.loadSounds();
  }

  initPhysics() {
    this.mapSystem.initPhysics();
  }

  async connect(playerName: string) {
    await this.networkManager.connect(playerName);

    this.networkManager.onPlayerUpdate((data) => {
      this.playerSystem.updatePlayer(data);
    });

    this.networkManager.onKill((data) => {
      this.gameStore.addKillFeed(data);
      this.soundManager.playSound('kill');
    });

    this.networkManager.onShot((data) => {
      this.soundManager.playSound('shot', { weapon: data.weapon });
      this.effectsSystem.createMuzzleFlash(data.shooterId);
    });

    this.networkManager.onRoundStart((data) => {
      this.gameStore.currentRound = data.round;
      this.gameStore.state = 'freezeTime';
      this.soundManager.playSound('roundStart');
    });

    this.networkManager.onRoundEnd((data) => {
      this.gameStore.ctScore = data.ctScore;
      this.gameStore.tScore = data.tScore;
      this.gameStore.state = 'roundEnd';
      this.soundManager.playSound('roundEnd');
    });

    this.networkManager.onMatchEnd((data) => {
      this.gameStore.matchWinner = data.winner;
      this.gameStore.state = 'matchEnd';
    });
  }

  start() {
    this.gameStore.state = 'playing';
  }

  private render() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    if (!this.console.isOpened()) {
      this.inputManager.update(deltaTime);
      this.networkManager.sendInput(this.inputManager.getState());
    }

    this.playerSystem.update(deltaTime);
    this.weaponSystem.update(deltaTime);
    this.effectsSystem.update(deltaTime);

    this.scene.render();
  }

  dispose() {
    this.networkManager.disconnect();
    this.console.dispose();
    this.antiCheat.dispose();
    this.soundManager.dispose();
    this.scene.dispose();
    this.engine.dispose();
  }
}