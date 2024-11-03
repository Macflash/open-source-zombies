import { Bullet } from "./bullet";
import { KeyboardListener } from "./keyboard";
import { bang, Sound } from "./sound";
import { Vec2 } from "./vec2";
import { Entity, World } from "./world";

export interface Gun {
  ammo: number;
  clip: number;
  isReloading: boolean;
  shoot(pos: Vec2, dir: Vec2): Bullet[];
  reload(): void;
  doStep(world: World): void;
}

export class Shotgun implements Gun {
  public ammo = 100;
  public clip = 6;
  public isReloading = false;

  private shootDelay = 0;
  private reloadDelay = 0;

  doStep() {
    if (this.shootDelay > 0) this.shootDelay--;
    if (this.reloadDelay > 0) this.reloadDelay--;
    if (this.isReloading || KeyboardListener.isPressed("r")) this.reload();
  }

  shoot(pos: Vec2, dir: Vec2) {
    this.isReloading = false;
    if (this.shootDelay > 0) return [];
    if (this.clip <= 0) return [];
    this.clip--;
    this.shootDelay = 75;

    return [
      new Bullet(pos, dir.multiply(2)),
      new Bullet(pos, dir.rotate(0.1).multiply(2)),
      new Bullet(pos, dir.rotate(-0.1).multiply(2)),
    ];
  }

  reload() {
    if (this.ammo <= 0 || this.clip >= 6) {
      this.isReloading = false;
      return;
    }
    this.isReloading = true;

    if (this.reloadDelay > 0) return;
    this.clip++;
    this.ammo--;
    this.reloadDelay = 75;
  }
}

abstract class GenericGun implements Gun {
  abstract readonly clipSize: number;

  abstract readonly reloadTime: number;
  abstract readonly shootTime: number;

  public ammo = 200;
  public clip = 0;
  public isReloading = false;

  private shootDelay = 0;
  private reloadDelay = 0;

  doStep() {
    if (this.shootDelay > 0) this.shootDelay--;
    if (this.reloadDelay > 0) this.reloadDelay--;
    if (KeyboardListener.isPressed("r")) this.reload();
  }

  shoot(pos: Vec2, dir: Vec2) {
    this.isReloading = false;
    if (this.shootDelay > 0) return [];
    if (this.clip <= 0) return [];
    this.clip--;
    this.shootDelay = this.shootTime;

    Sound.bang();
    return this.spawnBullets(pos, dir);
  }

  protected spawnBullets(pos: Vec2, dir: Vec2): Bullet[] {
    return [new Bullet(pos.clone(), dir.multiply(3))];
  }

  reload() {
    if (this.ammo <= 0 || this.clip >= this.clipSize) {
      this.isReloading = false;
      return;
    }
    this.isReloading = true;

    if (this.reloadDelay > 0) return;
    Sound.reload();
    const remaining = Math.min(this.ammo, this.clipSize);
    this.clip = remaining;
    this.ammo -= remaining;
    this.reloadDelay = this.reloadTime;
    this.shootDelay = this.reloadTime; // this is to prevent shooting while reloading, for generic guns atleast.
  }
}

export class AR extends GenericGun {
  readonly clipSize = 30;
  readonly reloadTime = 200;
  readonly shootTime = 10;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}
