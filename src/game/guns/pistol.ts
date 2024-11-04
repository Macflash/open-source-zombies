import { Bullet } from "../bullet";
import { Keyboard } from "../input/keyboard";
import { Mouse } from "../input/mouse";
import { Player } from "../player";
import { Sound } from "../sound";
import { Vec2 } from "../vec2";
import { Gun } from "./gun";

abstract class GenericGun implements Gun {
  abstract readonly bulletDamage: number;
  abstract readonly bulletSpeed: number;
  abstract readonly clipSize: number;

  abstract readonly reloadTime: number;
  abstract readonly shootTime: number;
  abstract ammo: number;
  public clip = 0;
  public isReloading = false;

  private shootDelay = 0;
  private reloadDelay = 0;
  protected reloadOneByOne = false;
  abstract readonly length: number;

  doStep(player: Player): Bullet[] | undefined {
    if (this.shootDelay > 0) this.shootDelay--;
    if (this.reloadDelay > 0) this.reloadDelay--;
    if (Keyboard.isDown("r")) this.reload();
    if (Mouse.isDown()) return this.shoot(player);
  }

  shoot(player: Player) {
    this.isReloading = false;
    if (this.shootDelay > 0) return [];
    if (this.clip <= 0) {
      this.reload();
      return [];
    }
    this.clip--;
    this.shootDelay = this.shootTime;

    this.clip == 0 ? Sound.nuhuh() : Sound.bang();
    return this.spawnBullets(player);
  }

  protected spawnBullets(player: Player): Bullet[] {
    return [
      new Bullet(
        player.pos.clone(),
        player.dir.multiply(this.bulletSpeed),
        this.bulletDamage
      ),
    ];
  }

  reload() {
    if (this.ammo <= 0 || this.clip >= this.clipSize) {
      this.isReloading = false;
      return;
    }
    this.isReloading = true;

    if (this.reloadDelay > 0) return;
    Sound.reload();
    // MAGICALLY we fill the magazine without losing anything left in the previous clip.
    // Similar to like COD, etc.
    const remaining = Math.min(this.ammo, this.clipSize - this.clip);
    this.clip = this.clipSize;
    this.ammo -= remaining;
    this.reloadDelay = this.reloadTime;
    this.shootDelay = this.reloadTime; // this is to prevent shooting while reloading, for generic guns atleast.
  }
}

export class Pistol extends GenericGun {
  readonly clipSize = 9;
  readonly reloadTime = 100;
  readonly shootTime = 25;
  readonly ammo = 72;
  readonly bulletDamage = 50;
  readonly bulletSpeed = 3;
  readonly length = 35;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}

export class Rifle extends GenericGun {
  readonly clipSize = 5;
  readonly reloadTime = 100;
  readonly shootTime = 35;
  readonly ammo = 35;
  readonly bulletDamage = 100;
  readonly bulletSpeed = 4;
  readonly length = 55;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}

export class AssaultRifle extends GenericGun {
  readonly clipSize = 20;
  readonly reloadTime = 100;
  readonly shootTime = 25;
  readonly ammo = 60;
  readonly bulletDamage = 55;
  readonly bulletSpeed = 3.5;
  readonly length = 55;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}
