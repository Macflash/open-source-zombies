import { RandomGun } from "./guns/gun";
import { Keyboard } from "./input/keyboard";
import { Mouse } from "./input/mouse";
import { Sound } from "./sound";
import { World } from "./world";

export class Game {
  public renderFunction: (frame: number) => void = () => {};
  private renderbit = 0;

  public world = new World(100);
  private spawner = new Spawner();
  private gunSpawner = new GunSpawner();

  private gameInterval = 0;

  constructor(readonly size: number) {
    Keyboard.onDown.sub((key: string) => {
      if (key == "escape") {
        console.log();
        if (this.isGameRunning()) this.pause();
        else this.play();
      }
      if (key == "q") {
        const temp = this.world.activeGun;
        this.world.activeGun = this.world.secondaryGun;
        this.world.secondaryGun = temp;
      }
    });
  }

  isGameOver() {
    return this.world.player.health <= 0;
  }

  isGameRunning() {
    return !!this.gameInterval;
  }

  restart() {
    this.world = new World(this.size);
    for (let i = 0; i < 4; i++) this.world.addBuilding();
    for (let i = 0; i < 2; i++) this.world.addZombie();
    // for (let i = 0; i < 2; i++) this.world.addGun(RandomGun());
    this.spawner = new Spawner();
    this.gunSpawner = new GunSpawner();
    this.play();
  }

  play() {
    if (this.isGameOver()) return;
    if (this.gameInterval) return;
    this.gameInterval = window.setInterval(() => {
      this.doStep();
    }, 10);
  }

  pause() {
    if (!this.gameInterval) return;
    window.clearInterval(this.gameInterval);
    this.gameInterval = 0;
    this.renderFunction((this.renderbit = 0));
  }

  doStep() {
    if (!this.gameInterval) return;
    this.world.doStep();
    this.spawner.doStep(this.world);
    this.gunSpawner.doStep(this.world);
    this.renderFunction(++this.renderbit);
    if (this.isGameOver()) {
      Sound.gameover();
      this.pause();
    }
  }
}

// spawns zombies, this rate can slowly increase?
class Spawner {
  private spawnTimer = 0;
  private spawnRate = 150;
  private maxZombies = 75;

  doStep(world: World) {
    if (world.zombies.length > this.maxZombies) return;
    if (this.spawnTimer > 0) {
      this.spawnTimer--;
      return;
    }
    this.spawnTimer = this.spawnRate;
    this.spawnRate *= 0.99;
    world.addZombie();
  }
}

// spawns zombies, this rate can slowly increase?
class GunSpawner {
  private spawnTimer = 0;
  private spawnRate = 1000;
  private maxSpawned = 2;

  doStep(world: World) {
    if (world.drops.length > this.maxSpawned) return;
    if (this.spawnTimer > 0) {
      this.spawnTimer--;
      return;
    }
    this.spawnTimer = this.spawnRate;
    this.spawnRate *= 1.1;
    world.addGun(RandomGun());
  }
}
