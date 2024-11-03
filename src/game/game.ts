import { World } from "./world";

export class Game {
  public renderFunction: (frame: number) => void = () => {};
  private renderbit = 0;

  public world: World;
  private spawner = new Spawner();

  private gameInterval = 0;

  constructor(readonly size: number) {
    this.world = new World(this.size);
  }

  isGameOver() {
    return this.world.player.health <= 0;
  }

  isGameRunning() {
    return !!this.gameInterval;
  }

  restart() {
    this.world = new World(this.size);
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
    if (this.gameInterval) window.clearInterval(this.gameInterval);
  }

  doStep() {
    if (!this.gameInterval) return;
    this.world.doStep();
    this.spawner.doStep(this.world);
    this.renderFunction(++this.renderbit);
    if (this.isGameOver()) this.pause();
  }
}

// spawns zombies, this rate can slowly increase?
class Spawner {
  private spawnTimer = 0;
  private spawnRate = 50;

  doStep(world: World) {
    if (world.zombies.length > 50) return;
    if (this.spawnTimer > 0) {
      this.spawnTimer--;
      return;
    }
    this.spawnTimer = this.spawnRate;
    world.addZombie();
  }
}
