import { Keyboard } from "./keyboard";
import { Mouse } from "./mouse";
import { Sound } from "./sound";
import { World } from "./world";

export class Game {
  public renderFunction: (frame: number) => void = () => {};
  private renderbit = 0;

  public world = new World(100);
  private spawner = new Spawner();

  private gameInterval = 0;

  constructor(readonly size: number) {
    this.restart();

    Keyboard.onDown.sub((key: string) => {
      if (key == "escape") {
        console.log();
        if (this.isGameRunning()) this.pause();
        else this.play();
      }
    });

    Mouse.mouseDown.sub(() => {
      if (!this.gameInterval) return;
      console.log("mouse down", Mouse.pos());
      this.world.click(Mouse.pos());
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
    for (let i = 0; i < 10; i++) this.world.addZombie();
    for (let i = 0; i < 4; i++) this.world.addBuilding();
    this.spawner = new Spawner();
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
  }

  doStep() {
    if (!this.gameInterval) return;
    this.world.doStep();
    this.spawner.doStep(this.world);
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
  private spawnRate = 100;
  private maxZombies = 75;

  doStep(world: World) {
    if (world.zombies.length > this.maxZombies) return;
    if (this.spawnTimer > 0) {
      this.spawnTimer--;
      return;
    }
    this.spawnTimer = this.spawnRate--;
    world.addZombie();
  }
}
