import { Bullet } from "./bullet";
import { Keyboard } from "../input/keyboard";
import { Mouse } from "../input/mouse";
import { Player } from "../player";
import { Sound } from "../sound";
import { Vec2 } from "../physics/vec2";
import { Gun } from "./gun";
import { World } from "../world";
import { intersectRay } from "../physics/ray";
import { angleBetween } from "../physics/rotation";

abstract class GenericGun implements Gun {
  abstract readonly bulletDamage: number;
  abstract readonly bulletSpeed: number;
  abstract readonly clipSize: number;

  abstract readonly reloadTime: number;
  abstract readonly shootTime: number;
  abstract ammo: number;
  clip = 0;
  isReloading = false;

  private shootDelay = 0;
  private reloadDelay = 0;
  protected reloadOneByOne = false;
  abstract readonly length: number;

  protected spread = 0;

  dir = new Vec2(1, 0);
  vel = 0;
  force = 0.2;
  isInWall = false;

  doStep(world: World): Bullet[] | undefined {
    if (this.shootDelay > 0) this.shootDelay--;
    if (this.reloadDelay > 0) this.reloadDelay--;
    if (Keyboard.isDown("r")) this.reload();

    // const angleDiff = angleBetween(world.player.dir, this.dir);
    // console.log("angle", angleDiff);

    // // need to figure out shortest direction to the proper dir!

    // if (angleDiff > 0 && angleDiff <= Math.PI)
    //   this.vel +=
    //     this.force / this.length; //TODO: using length as MASS for now.
    // else this.vel -= this.force / this.length; //TODO: using length as MASS for now.
    // this.vel *= 0.9;
    // this.dir = this.dir.rotate(this.vel);
    this.dir = world.player.dir.clone();

    // check if we are intersecting a wall!
    for (const building of world.buildings) {
      if (
        intersectRay(
          {
            pos: world.player.pos,
            vec: world.player.dir.multiply(this.length),
            steps: this.length / 10,
          },
          building
        )
      ) {
        // don't allow shooting.
        // TODO: Should we prevent the gun from rotating that way?
        // Or maybe clamp it to the nearest rotation that doesn't intersect?
        this.isInWall = true;
        return;
      }
    }
    this.isInWall = false;
    if (Mouse.isDown()) return this.shoot(world);
  }

  shoot(world: World) {
    this.isReloading = false;
    if (this.shootDelay > 0) return [];
    if (this.clip <= 0) {
      this.reload();
      return [];
    }
    this.clip--;
    this.shootDelay = this.shootTime;

    this.clip == 0 ? Sound.ding() : Sound.bang();
    return this.spawnBullets(world);
  }

  protected spawnBullets(world: World): Bullet[] {
    const { player } = world;
    return [
      new Bullet(
        player.pos.plus(this.dir.multiply(this.length)),
        this.dir
          .rotate(this.spread * (Math.random() - 0.5))
          .multiply(this.bulletSpeed),
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
  readonly length = 15;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}

export class Rifle extends GenericGun {
  readonly clipSize = 5;
  readonly reloadTime = 100;
  readonly shootTime = 55;
  readonly ammo = 35;
  readonly bulletDamage = 100;
  readonly bulletSpeed = 4;
  readonly length = 45;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}

export class AssaultRifle extends GenericGun {
  readonly clipSize = 20;
  readonly reloadTime = 100;
  readonly shootTime = 10;
  readonly ammo = 60;
  readonly bulletDamage = 55;
  readonly bulletSpeed = 3.5;
  readonly length = 25;
  override spread = 0.1;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}

export class Minigun extends GenericGun {
  readonly clipSize = 100;
  readonly reloadTime = 300;
  readonly shootTime = 5;
  readonly ammo = 300;
  readonly bulletDamage = 34;
  readonly bulletSpeed = 3.5;
  readonly length = 20;

  override spread = 0.25;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}

export class AutoShotgun extends GenericGun {
  readonly clipSize = 8;
  readonly reloadTime = 150;
  readonly shootTime = 60;
  readonly ammo = 36;
  readonly bulletDamage = 34;
  readonly bulletSpeed = 3.5;
  readonly length = 30;

  override spread = 0.25;

  constructor() {
    super();
    this.clip = this.clipSize;
  }

  protected override spawnBullets(world: World): Bullet[] {
    const { player } = world;
    return [
      new Bullet(
        player.pos.plus(this.dir.multiply(this.length)),
        this.dir.rotate(this.spread * Math.random()).multiply(this.bulletSpeed),
        this.bulletDamage
      ),
      new Bullet(
        player.pos.plus(this.dir.multiply(this.length)),
        this.dir
          .rotate(this.spread * -1 * Math.random())
          .multiply(this.bulletSpeed),
        this.bulletDamage
      ),
      new Bullet(
        player.pos.plus(this.dir.multiply(this.length)),
        this.dir
          .rotate(this.spread * (Math.random() - 0.5))
          .multiply(this.bulletSpeed),
        this.bulletDamage
      ),
      new Bullet(
        player.pos.plus(this.dir.multiply(this.length)),
        this.dir
          .rotate(this.spread * (Math.random() - 0.5))
          .multiply(this.bulletSpeed),
        this.bulletDamage
      ),
    ];
  }
}
