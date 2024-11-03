import { intersectSquare } from "./physics";
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
      world.corpses.push(new Corpse(this));
      if (world.corpses.length > 25) world.corpses.unshift();
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

    // avoid massing
    for (const z of world.zombies) {
      if (z == this) continue;
      if (intersectSquare(this, z)) {
        // push apart?
        const dist = this.pos.directionTo(z.pos).multiply(0.75);
        z.pos = z.pos.plus(dist);
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
  public size = 20;
  public color = "brown";

  constructor(zombie: Zombie) {
    this.pos = zombie.pos;
    this.key = zombie.key;
  }
}
