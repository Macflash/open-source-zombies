import { intersectSquare } from "./collision";
import { Positionable, Vec2 } from "./vec2";
import { Entity, World } from "./world";

let bkey = 0;

export class Bullet implements Entity {
  public readonly key = ++bkey;
  public size = 5;
  public color = "gold";
  constructor(public pos: Vec2, public vel: Vec2) {}

  doStep(world: World): boolean {
    // go towards the player
    this.pos = this.pos.plus(this.vel);

    // Check for zombie hits
    const hit = world.zombies.find(
      (z) => z.health > 0 && intersectSquare(this, z)
    );
    if (hit) {
      hit.takeDamage(50);
      return false;
    }

    // Delete if it hits the edge!
    if (this.pos.x < 0 || this.pos.y < 0) return false;
    if (this.pos.x > world.size || this.pos.y > world.size) return false;
    return true;
  }
}
