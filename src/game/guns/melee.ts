import { Mouse } from "../input/mouse";
import { World } from "../world";

export interface MeleeWeapon {
  range: number;
  damage: number;
  force: number;

  isSwinging: boolean;

  doStep(world: World): void;
}

abstract class Melee {
  abstract readonly range: number;
  abstract readonly damage: number;
  abstract readonly force: number;
  abstract readonly cooldownStat: number;

  public isSwinging = false;

  private cooldown = 0;

  doStep(world: World) {
    if (this.cooldown > 0) {
      if (this.cooldown < this.cooldownStat - 20) this.isSwinging = false;
      this.cooldown--;
      return;
    }
    if (!Mouse.isRight()) return;

    this.isSwinging = true;
    this.cooldown = this.cooldownStat;

    // check if zombie is in RANGE
    world.zombies.forEach((z) => {
      if (z.pos.distanceTo(world.player.pos) <= this.range) {
        z.takeDamage(this.damage);
        const knockback = world.player.pos
          .directionTo(z.pos)
          .multiply((5 * this.force) / z.mass);
        console.log(knockback);
        z.pos = z.pos.plus(knockback);
      }
    });
  }
}

export class Knife extends Melee {
  readonly range = 30;
  readonly damage = 75;
  readonly force = 100;
  readonly cooldownStat = 100;
}

export class Ax extends Melee {
  readonly range = 50;
  readonly damage = 100;
  readonly force = 200;
  readonly cooldownStat = 250;
}

export class Bash extends Melee {
  readonly range = 40;
  readonly damage = 25;
  readonly force = 150;
  readonly cooldownStat = 150;
}
