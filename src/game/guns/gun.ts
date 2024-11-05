import { Bullet } from "./bullet";
import { intersectRect } from "../physics/rect";
import { Vec2 } from "../physics/vec2";
import { Entity, World } from "../world";
import {
  AssaultRifle,
  AutoShotgun,
  Katana,
  Knife,
  Minigun,
  Pistol,
  Rifle,
  SledgeHammer,
} from "./pistol";

export interface Gun {
  name: string;
  dir: Vec2;
  vel: number;
  ammo: number;
  clip: number;
  isReloading: boolean;
  length: number;
  isInWall?: boolean;
  color?: string;
  width: number;
  image?: string;
  shoot(world: World): Bullet[];
  reload(): void;
  doStep(world: World): Bullet[] | undefined;
}

export class GunDrop implements Entity {
  readonly size = Vec2.square(20);
  readonly color = "lightblue";
  constructor(public readonly pos: Vec2, public readonly gun: Gun) {}

  doStep(world: World): boolean {
    if (intersectRect(this, world.player)) {
      world.activeGun = this.gun;
      return false;
    }
    return true;
  }
}

export function RandomGun(): Gun {
  const guns: Gun[] = [
    new Pistol(),
    // new Shotgun(),
    new AutoShotgun(),
    new AssaultRifle(),
    new Rifle(),
    new Minigun(),
    new Katana(),
    new Knife(),
    new SledgeHammer(),
  ];
  const r = Math.floor(Math.random() * guns.length);
  return guns[r];
}
