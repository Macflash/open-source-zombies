import { intersectSquare } from "./collision";
import { Sound } from "./sound";
import { Positionable, Vec2 } from "./vec2";
import { Entity, World } from "./world";

let zkey = 0;

export class Zombie implements Entity {
  public readonly key = ++zkey;
  constructor(public pos: Vec2) {}

  public health = 100;
  public size = 15;
  public color = "green";

  private attackDelay = 0;
  private attackDelayStat = 100;

  doStep(world: World): boolean {
    if (this.health <= 0) {
      world.playerScore += 10;
      //   Sound.zombie();
      return false;
    }

    // go towards the player
    const dirVec = this.pos.directionTo(world.player.pos);
    this.pos = this.pos.plus(dirVec.multiply(0.5));

    if (this.attackDelay > 0) this.attackDelay--;
    else if (intersectSquare(this, world.player)) {
      world.player.takeDamage(10);
      this.attackDelay = this.attackDelayStat;
    }

    return true;
  }

  takeDamage(damage: number) {
    if (this.health <= 0) return;
    this.health -= damage;
  }
}
