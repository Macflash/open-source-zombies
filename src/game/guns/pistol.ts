import { Bullet } from "../bullet";
import { Keyboard } from "../keyboard";
import { Sound } from "../sound";
import { Vec2 } from "../vec2";
import { Gun } from "./gun";

abstract class GenericGun implements Gun {
  abstract readonly clipSize: number;

  abstract readonly reloadTime: number;
  abstract readonly shootTime: number;
  abstract ammo: number;
  public clip = 0;
  public isReloading = false;

  private shootDelay = 0;
  private reloadDelay = 0;

  doStep() {
    if (this.shootDelay > 0) this.shootDelay--;
    if (this.reloadDelay > 0) this.reloadDelay--;
    if (Keyboard.isDown("r")) this.reload();
  }

  shoot(pos: Vec2, dir: Vec2) {
    this.isReloading = false;
    if (this.shootDelay > 0) return [];
    if (this.clip <= 0) {
      Sound.nuhuh();
      return [];
    }
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

export class Pistol extends GenericGun {
  readonly clipSize = 9;
  readonly reloadTime = 100;
  readonly shootTime = 25;
  readonly ammo = 100;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}