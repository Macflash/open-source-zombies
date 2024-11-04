import { Bullet } from "../bullet";
import { intersectRect } from "../physics";
import { Vec2 } from "../vec2";
import { Entity, World } from "../world";

export interface Gun {
  ammo: number;
  clip: number;
  isReloading: boolean;
  shoot(pos: Vec2, dir: Vec2): Bullet[];
  reload(): void;
  doStep(world: World): void;
}

export class GunDrop implements Entity {
  readonly size = Vec2.square(20);
  readonly color = "lightblue";
  constructor(public readonly pos: Vec2, private readonly gun: Gun) {}

  doStep(world: World): boolean {
    if (intersectRect(this, world.player)) {
      world.activeGun = this.gun;
      return false;
    }
    return true;
  }
}
