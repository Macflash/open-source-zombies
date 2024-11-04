import { Collidable, collideInelastic } from "./physics/collision";
import { intersectRect, unintersectRect } from "./physics/rect";
import { Vec2 } from "./physics/vec2";
import { Entity, World } from "./world";

let zkey = 0;

export class Zombie implements Entity, Collidable {
  public readonly key = ++zkey;
  constructor(public pos: Vec2) {}

  public mass = 50;
  public force = 1;
  public maxSpeed = 0.5;
  public vel = new Vec2(0, 0);
  public health = 100;
  public size = Vec2.square(15);
  public color = "green";

  private attackDelay = 0;
  private attackDelayStat = 100;

  doStep(world: World): boolean {
    if (this.health <= 0) {
      world.playerScore += 10;
      //   Sound.zombie();
      world.corpses.push(new Corpse(this));
      if (world.corpses.length > 25) world.corpses.unshift();
      return false;
    }

    // go towards the player
    const dirVec = this.pos.directionTo(world.player.pos);
    this.vel = this.vel
      .plus(dirVec.multiply(this.force / this.mass))
      .multiply(0.98);
    this.pos = this.pos.plus(this.vel);

    if (intersectRect(this, world.player)) {
      unintersectRect(this, world.player);
      if (this.attackDelay > 0) this.attackDelay--;
      else {
        world.player.takeDamage(10);
        this.attackDelay = this.attackDelayStat;
      }
    }

    // avoid massing
    for (const z of world.zombies) {
      if (z == this) continue;
      if (intersectRect(this, z)) {
        // prevent overlapping
        unintersectRect(this, z);
        // update velocities.
        collideInelastic(this, z);
      }
    }

    // avoid buildings
    for (const b of world.buildings) {
      if (intersectRect(this, b)) {
        unintersectRect(this, b);
        // Hmm.
      }
    }

    return true;
  }

  takeDamage(damage: number) {
    if (this.health <= 0) return;
    this.health -= damage;
  }
}

export class Corpse implements Entity {
  public pos: Vec2;
  public key: number;
  public size = Vec2.square(20);
  public color = "brown";
  public className = "Corpse";

  constructor(zombie: Zombie) {
    this.pos = zombie.pos;
    this.key = zombie.key;
  }
}
