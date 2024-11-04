import { intersectRect } from "../physics/rect";
import { Vec2 } from "../physics/vec2";
import { Entity, World } from "../world";

let bkey = 0;

export class Bullet implements Entity {
  public readonly key = ++bkey;
  public size: Vec2;
  public color = "black";
  constructor(public pos: Vec2, public vel: Vec2, private damage = 50) {
    this.size = Vec2.square(this.damage / 10);
  }

  doStep(world: World): boolean {
    // go towards the player
    this.pos = this.pos.plus(this.vel);

    // Check for zombie hits
    const hit = world.zombies.find(
      (z) => z.health > 0 && intersectRect(this, z)
    );
    if (hit) {
      hit.takeDamage(this.damage);
      hit.vel = hit.vel.plus(this.vel.multiply((0.5 * this.damage) / hit.mass));
      return false;
    }

    // check for building hits.
    if (world.buildings.some((b) => intersectRect(this, b))) return false;

    // Delete if it hits the edge!
    if (this.pos.x < 0 || this.pos.y < 0) return false;
    if (this.pos.x > world.size || this.pos.y > world.size) return false;
    return true;
  }
}
