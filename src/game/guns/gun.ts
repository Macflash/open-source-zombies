import { Bullet } from "../bullet";
import { Vec2 } from "../vec2";
import { World } from "../world";

export interface Gun {
  ammo: number;
  clip: number;
  isReloading: boolean;
  shoot(pos: Vec2, dir: Vec2): Bullet[];
  reload(): void;
  doStep(world: World): void;
}
