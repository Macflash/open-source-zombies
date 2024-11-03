import { World } from "./world";

export class Game {
  public world: World;

  constructor(readonly size: number) {
    this.world = new World(this.size);
  }

  start() {}
}
