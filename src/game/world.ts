import { Bullet } from "./guns/bullet";
import { Gun, GunDrop } from "./guns/gun";
import { AssaultRifle, Pistol, Rifle, Knife } from "./guns/pistol";
import { Shotgun } from "./guns/shotgun";
import { Mouse } from "./input/mouse";
import { Player } from "./player";
import { Positionable, Vec2 } from "./physics/vec2";
import { Corpse, Zombie } from "./zombie";
import { intersectRect } from "./physics/rect";

export interface Entity extends Positionable {
  size: Vec2;
  color: string;
  className?: string;
  vel?: Vec2;
  radius?: number;
  image?: string;
}

export class Building implements Entity {
  color = "grey";
  constructor(public readonly pos: Vec2, public readonly size: Vec2) {}
}

export class World {
  constructor(public size: number) {
    this.player = new Player(new Vec2(this.size / 2, this.size / 2));
  }

  public player: Player;
  public playerScore = 0;
  public playerBullets: Bullet[] = [];

  public activeGun: Gun = new Pistol();
  public secondaryGun: Gun = new Knife();

  public zombies: Zombie[] = [];
  public corpses: Corpse[] = [];
  public buildings: Building[] = [];
  public drops: GunDrop[] = [];

  public renderer: () => void = () => {};

  doStep() {
    this.player.doStep(this);
    this.playerBullets = this.playerBullets.filter((b) => b.doStep(this));
    this.playerBullets.push(...(this.activeGun.doStep(this) || []));
    // Removing the melee mechanic since guns can sorta bash zombies now.
    // this.activeMelee.doStep(this);

    this.drops = this.drops.filter((drop) => drop.doStep(this));
    this.zombies = this.zombies.filter((z) => z.doStep(this));
    this.renderer();
  }

  addZombie() {
    const edge = Math.random() < 0.5;
    const flip = Math.random() < 0.5 ? this.size : 0;
    const z = new Zombie(
      new Vec2(
        edge ? flip : Math.random() * this.size,
        edge ? Math.random() * this.size : flip
      )
    );
    // Don't spawn inside buildings.
    if (this.buildings.some((b) => intersectRect(b, z))) return;
    this.zombies.push(z);
  }

  addBuilding() {
    this.buildings.push(
      new Building(
        new Vec2(Math.random() * this.size, Math.random() * this.size),
        new Vec2(100 + Math.random() * 200, 100 + Math.random() * 200)
      )
    );
  }

  addGun(gun: Gun) {
    this.drops.push(
      new GunDrop(
        new Vec2(Math.random() * this.size, Math.random() * this.size),
        gun
      )
    );
  }
}
