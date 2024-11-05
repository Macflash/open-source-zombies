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

import gun_default from "../../img/gun_default.png";
import gun_shotgun from "../../img/gun_shotgun.png";
import gun_pistol from "../../img/gun_pistol.png";
import gun_ar from "../../img/gun_ar.png";
import gun_sniper from "../../img/gun_sniper.png";
import gun_mini from "../../img/gun_minigun.png";

import melee_sword from "../../img/melee_sword.png";
import melee_sledge from "../../img/melee_sledge.png";

abstract class GenericGun implements Gun {
  abstract readonly name: string;
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

  width = 4;

  protected bashDamage = 10;
  protected bashForce = 0.5;
  protected bashForceKickback?: number;

  image = gun_default;
  meleeSound = Sound.bonk;

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

    // check if we are intersecting a zombie!
    for (const z of world.zombies.filter(
      (z) => z.pos.distanceTo(world.player.pos) < this.length + 20
    )) {
      if (
        intersectRay(
          {
            pos: world.player.pos,
            vec: world.player.dir.multiply(this.length),
            steps: 5,
          },
          z
        )
      ) {
        z.vel = z.vel.plus(this.dir.multiply(this.bashForce));
        world.player.vel = world.player.vel.minus(
          this.dir.multiply(this.bashForceKickback ?? 0.5 * this.bashForce)
        );
        z.takeDamage(this.bashDamage);
        this.meleeSound();
      }
    }

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
  readonly name = "Pistol";
  readonly clipSize = 9;
  readonly reloadTime = 100;
  readonly shootTime = 25;
  readonly ammo = 72;
  readonly bulletDamage = 50;
  readonly bulletSpeed = 3;
  readonly length = 15;

  color = "black";
  image = gun_pistol;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}

export class Rifle extends GenericGun {
  readonly name = "Sniper Rifle";
  readonly clipSize = 5;
  readonly reloadTime = 100;
  readonly shootTime = 55;
  readonly ammo = 35;
  readonly bulletDamage = 100;
  readonly bulletSpeed = 4;
  readonly length = 45;

  protected override bashForce = 0.7;

  color = "brown";
  width = 5;
  image = gun_sniper;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}

export class AssaultRifle extends GenericGun {
  readonly name = "Assault Rifle";
  readonly clipSize = 20;
  readonly reloadTime = 100;
  readonly shootTime = 10;
  readonly ammo = 60;
  readonly bulletDamage = 55;
  readonly bulletSpeed = 3.5;
  readonly length = 30;
  override spread = 0.1;

  color = "darkgreen";
  image = gun_ar;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}

export class Minigun extends GenericGun {
  readonly name = "Minigun";
  readonly clipSize = 100;
  readonly reloadTime = 300;
  readonly shootTime = 5;
  readonly ammo = 300;
  readonly bulletDamage = 25;
  readonly bulletSpeed = 3.5;
  readonly length = 35;

  override spread = 0.25;
  override width = 10;
  image = gun_mini;

  constructor() {
    super();
    this.clip = this.clipSize;
  }
}

export class SledgeHammer extends GenericGun {
  readonly name = "Sledgehammer";
  readonly clipSize = 0;
  readonly reloadTime = 1;
  readonly shootTime = 1;
  readonly ammo = 0;
  readonly bulletDamage = 0;
  readonly bulletSpeed = 0;
  readonly length = 50;
  protected override bashDamage = 35;
  protected override bashForce = 3;
  protected override bashForceKickback = 0.3;

  color = "darkblue";
  width = 6;
  image = melee_sledge;

  constructor() {
    super();
  }

  protected override spawnBullets(world: World): Bullet[] {
    return [];
  }
}

export class Katana extends GenericGun {
  readonly name = "Sword";
  readonly clipSize = 0;
  readonly reloadTime = 1;
  readonly shootTime = 1;
  readonly ammo = 0;
  readonly bulletDamage = 0;
  readonly bulletSpeed = 0;
  readonly length = 45;
  protected override bashDamage = 75;
  protected override bashForce = 1;

  width = 3;
  color = "lightgrey";
  image = melee_sword;
  meleeSound = Sound.melee;

  constructor() {
    super();
  }

  protected override spawnBullets(world: World): Bullet[] {
    return [];
  }
}

export class Knife extends GenericGun {
  readonly name = "Knife";
  readonly clipSize = 0;
  readonly reloadTime = 1;
  readonly shootTime = 1;
  readonly ammo = 0;
  readonly bulletDamage = 0;
  readonly bulletSpeed = 0;
  readonly length = 25;
  protected override bashDamage = 75;
  protected override bashForce = 0.7;

  width = 3;
  color = "lightgrey";
  image = melee_sword;
  meleeSound = Sound.melee;

  constructor() {
    super();
  }

  protected override spawnBullets(world: World): Bullet[] {
    return [];
  }
}

export class AutoShotgun extends GenericGun {
  readonly name = "Shotgun";
  readonly clipSize = 8;
  readonly reloadTime = 150;
  readonly shootTime = 60;
  readonly ammo = 36;
  readonly bulletDamage = 34;
  readonly bulletSpeed = 3.5;
  readonly length = 30;

  override spread = 0.25;
  image = gun_shotgun;

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
