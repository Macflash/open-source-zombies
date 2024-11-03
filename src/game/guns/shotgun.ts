import { Bullet } from "../bullet";
import { Keyboard } from "../keyboard";
import { Sound } from "../sound";
import { Vec2 } from "../vec2";
import { Gun } from "./gun";

export class Shotgun implements Gun {
  public ammo = 100;
  public clip = 6;
  public isReloading = false;

  private shootDelay = 0;
  private reloadDelay = 0;

  doStep() {
    if (this.shootDelay > 0) this.shootDelay--;
    if (this.reloadDelay > 0) this.reloadDelay--;
    if (this.isReloading || Keyboard.isDown("r")) this.reload();
  }

  shoot(pos: Vec2, dir: Vec2) {
    this.isReloading = false;
    if (this.shootDelay > 0) return [];
    if (this.clip <= 0) {
      Sound.nuhuh();
      return [];
    }
    this.clip--;
    this.shootDelay = 75;
    Sound.blam();
    return [
      new Bullet(pos, dir.multiply(3)),
      new Bullet(pos, dir.rotate(0.1).multiply(3)),
      new Bullet(pos, dir.rotate(-0.1).multiply(3)),
    ];
  }

  reload() {
    if (this.ammo <= 0 || this.clip >= 6) {
      this.isReloading = false;
      return;
    }
    this.isReloading = true;

    if (this.reloadDelay > 0) return;
    Sound.reload();
    this.clip++;
    this.ammo--;
    this.reloadDelay = 75;
  }
}
