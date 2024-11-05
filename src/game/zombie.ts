import { Collidable, collideInelastic } from "./physics/collision";
import { intersectRect, unintersectRect } from "./physics/rect";
import { Vec2 } from "./physics/vec2";
import { Sound } from "./sound";
import { Entity, World } from "./world";

import zombie_up from "../img/zombie_up.png";
import zombie_left from "../img/zombie_left.png";
import zombie_right from "../img/zombie_right.png";
import zombie_down from "../img/zombie_down.png";
import { SelectDirection } from "./physics/rotation";

const zombieImages = {
  left: zombie_left,
  right: zombie_right,
  up: zombie_up,
  down: zombie_down,
};

let zkey = 0;

export class Zombie implements Entity, Collidable {
  public readonly key = ++zkey;
  constructor(public pos: Vec2) {}

  public mass = 50;
  public force = 1; // movement
  public maxSpeed = 0.5;
  public vel = new Vec2(0, 0);
  public health = 100;
  public size = Vec2.square(15);
  public color = "green";

  private attackDelay = 0;
  private attackDelayStat = 100;

  image = zombie_down;

  doStep(world: World): boolean {
    const { player } = world;

    if (this.health <= 0) {
      world.playerScore += 10;
      //   Sound.zombie();
      world.corpses.push(new Corpse(this));
      if (world.corpses.length > 25) world.corpses.unshift();
      return false;
    }

    // go towards the player
    const dirVec = this.pos.directionTo(player.pos);

    // check the dirs!
    const newImage = SelectDirection<string>(dirVec, zombieImages);
    this.image = newImage || this.image;

    this.vel = this.vel
      .plus(dirVec.multiply(this.force / this.mass))
      .multiply(0.98);
    this.pos = this.pos.plus(this.vel);

    // Check if hitting the player!
    if (this.attackDelay > 0) this.attackDelay--;
    if (intersectRect(this, player)) {
      unintersectRect(this, player);
      collideInelastic(this, player);
      if (this.attackDelay <= 0) {
        player.vel = player.vel.plus(dirVec.multiply(1.5));
        player.takeDamage(10);
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
    Sound.tap();
    if (this.health <= 0) {
      this.health = 0;
      Sound.bonk();
    }
    // needs the world...
    //else world.corpses.push(new Corpse(this, Vec2.square(5)));
  }
}

export class Corpse implements Entity {
  public pos: Vec2;
  public key: number;
  public color = "brown";
  public className = "Corpse";

  constructor(zombie: Zombie, public size = Vec2.square(20)) {
    this.pos = zombie.pos;
    this.key = zombie.key;
  }
}
